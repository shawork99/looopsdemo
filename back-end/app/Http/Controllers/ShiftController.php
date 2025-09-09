<?php

namespace App\Http\Controllers;

use App\Models\UserDetails;
use App\Repositories\ShiftDetailRepository;
use App\Repositories\ShiftRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ShiftController extends Controller
{
    public function __construct(
        protected ShiftRepository $shiftRepository,
        protected ShiftDetailRepository $shiftDetailRepo
    ) {}

    public function index(Request $request)
    {
        $input = $request->only([
            'search',
            'perPage',
            'page'
        ]);

        $validator = Validator::make($input, [
            'search' => 'max:50',
            'perPage' => 'required|integer',
            'page' => 'required|integer'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $this->shiftRepository->getAll($input),
            'message' => 'Shift retrieved successfully'
        ], 200);
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'code',
            'name',
            'is_active',
            'shiftDetails'
        ]);
        try {
            $validator = Validator::make($input, [
                'code' => 'required|max:15|min:1',
                'name' => 'required|max:50|min:1',
                'is_active' => 'required|boolean',
                'shiftDetails' => 'required|array',
                'shiftDetails.*.day_name' => 'required|string',
                'shiftDetails.*.is_week_day' => 'required|boolean',
                'shiftDetails.*.grace_time' => 'nullable',
                'shiftDetails.*.work_hours_minute' => 'nullable|integer',
                'shiftDetails.*.start_time' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'regex:/^(?:[01]\d|2[0-3]):[0-5]\d$/'
                ],
                'shiftDetails.*.end_time' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'regex:/^(?:[01]\d|2[0-3]):[0-5]\d$/'
                ],
                'shiftDetails.*.work_hours_minute' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'integer',
                    'min:0'
                ],
                'shiftDetails.*.work_hours_minute' => [
                    'required_if:shiftDetails.*.is_week_day,true'
                ],
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $valid = true;
            foreach ($request->shiftDetails as $val) {
                if (!empty($val['start_time']) && !empty($val['end_time'])) {
                    [$startHour, $startMinute] = explode(':', $val['start_time']);
                    [$endHour, $endMinute] = explode(':', $val['end_time']);
                    $startTotalMinutes = ((int)$startHour * 60) + (int)$startMinute;
                    $endTotalMinutes = ((int)$endHour * 60) + (int)$endMinute;
                    if ($endTotalMinutes < $startTotalMinutes) {
                        $valid = false;
                        break;
                    }
                }
            }
            if (!$valid) {
                return response()->json([
                    'error' => 'End time must be greater than start time.'
                ], 422);
            }
            if ($this->shiftRepository->isCodeExists($input['code'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Shift code is already exists',
                ], 400);
            }
            DB::beginTransaction();
            $shift =  $this->shiftRepository->create($input);
            $shiftDetails = [];
            $weekday = [];
            $weekends = [];
            foreach ($request->shiftDetails as $val) {
                $shiftDetails[] = [
                    'shift_id' => $shift->id,
                    'day_name' => $val['day_name'],
                    'start_time' => isset($val['start_time']) ? $val['start_time'] : null,
                    'end_time' => isset($val['end_time']) ? $val['end_time'] : null,
                    'grace_time' => isset($val['grace_time']) ? $val['grace_time'] : null,
                    'work_hours' => isset($val['work_hours']) ? $val['work_hours'] : null,
                    'work_hours_minute' => isset($val['work_hours_minute']) ? $val['work_hours_minute'] : null,
                    'is_week_day' => isset($val['is_week_day']) ? $val['is_week_day'] : false,
                    'company_id' => Auth::user()->current_company_id
                ];
                if (isset($val['is_week_day']) && $val['is_week_day'] == true) {
                    $weekday[] = $val['day_name'];
                } else {
                    $weekends[] = $val['day_name'];
                }
            }
            $shift->update(
                [
                    'weekdays' => $weekday,
                    'weekend' => $weekends
                ]
            );
            $this->shiftDetailRepo->insert($shiftDetails);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Shift created successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, $shiftId)
    {
        $input = $request->only([
            'code',
            'name',
            'is_active',
            'shiftDetails'
        ]);
        try {
            $validator = Validator::make($input, [
                'code' => 'required|max:15|min:1',
                'name' => 'required|max:50|min:1',
                'is_active' => 'required|boolean',
                'shiftDetails' => 'required|array',
                'shiftDetails.*.day_name' => 'required|string',
                'shiftDetails.*.is_week_day' => 'required|boolean',
                'shiftDetails.*.grace_time' => 'nullable',
                'shiftDetails.*.work_hours_minute' => 'nullable|integer',
                'shiftDetails.*.start_time' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'regex:/^(?:[01]\d|2[0-3]):[0-5]\d$/'
                ],
                'shiftDetails.*.end_time' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'regex:/^(?:[01]\d|2[0-3]):[0-5]\d$/'
                ],
                'shiftDetails.*.work_hours_minute' => [
                    'required_if:shiftDetails.*.is_week_day,true',
                    'nullable',
                    'integer',
                    'min:0'
                ],
                'shiftDetails.*.work_hours_minute' => [
                    'required_if:shiftDetails.*.is_week_day,true'
                ],
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $valid = true;
            foreach ($input['shiftDetails'] as $val) {
                if (!empty($val['start_time']) && !empty($val['end_time'])) {
                    [$startHour, $startMinute] = explode(':', $val['start_time']);
                    [$endHour, $endMinute] = explode(':', $val['end_time']);
                    $startTotalMinutes = ((int)$startHour * 60) + (int)$startMinute;
                    $endTotalMinutes = ((int)$endHour * 60) + (int)$endMinute;
                    if ($endTotalMinutes < $startTotalMinutes) {
                        $valid = false;
                        break;
                    }
                }
            }

            if (!$valid) {
                return response()->json([
                    'error' => 'End time must be greater than start time.'
                ], 422);
            }
            DB::beginTransaction();
            $shift = $this->shiftRepository->find($shiftId);
            if (empty($shift)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Shift details not found',
                ], 404);
            }
            $shift->update($input);
            $shiftDetails = [];
            foreach ($request->shiftDetails as $val) {
                $shiftDetails[] = [
                    'shift_id' => $shift->id,
                    'day_name' => $val['day_name'],
                    'start_time' => isset($val['start_time']) ? $val['start_time'] : null,
                    'end_time' => isset($val['end_time']) ? $val['end_time'] : null,
                    'grace_time' => isset($val['grace_time']) ? $val['grace_time'] : null,
                    'work_hours' => isset($val['work_hours']) ? $val['work_hours'] : null,
                    'work_hours_minute' => isset($val['work_hours_minute']) ? $val['work_hours_minute'] : null,
                    'is_week_day' => isset($val['is_week_day']) ? $val['is_week_day'] : false,
                    'company_id' => Auth::user()->current_company_id
                ];
            }
            $this->shiftDetailRepo->deleteDetails($shift->id);
            $this->shiftDetailRepo->insert($shiftDetails);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Shift update successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($shiftId)
    {
        $shift = $this->shiftRepository->find($shiftId);
        if (empty($shift)) {
            return response()->json([
                'success' => false,
                'message' => 'Shift details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Shift retrieved successfully',
            'data' => $shift
        ], 200);
    }

    public function destroy($shiftId)
    {
        $shift = $this->shiftRepository->find($shiftId);
        if (empty($shift)) {
            return response()->json([
                'success' => false,
                'message' => 'Shift details not found',
            ], 404);
        }

        if (UserDetails::where('shift_id', $shiftId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This shift already pulled to user details',
            ], 404);
        }

        $shift->delete();
        return response()->json([
            'success' => true,
            'message' => 'Shift deleted successfully'
        ], 200);
    }
}
