<?php

namespace App\Http\Controllers;

use App\Models\LeaveType;
use App\Repositories\LeaveGroupDetailRepository;
use App\Repositories\LeaveGroupRepository;
use App\Repositories\LeaveTypeRepository;
use App\Repositories\UserRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LeaveGroupDetailController extends Controller
{

    public function __construct(
        protected LeaveTypeRepository $leaveTypeRepository,
        protected LeaveGroupRepository $leaveGroupRepository,
        protected LeaveGroupDetailRepository $leaveGroupDetailRepository,
        protected UserRepository $userRepository
    ) {}

    public function index(Request $request)
    {
        if ($request->has('formData')) {
            $input = $request->only(['leaveGroupId']);
            $validator = Validator::make($input, [
                'leaveGroupId' => 'required|integer'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }
            return response()->json([
                'success' => true,
                'data' => $this->getFormDetails($input),
                'message' => 'Form details retrive successfully'
            ], 200);
        }
    }

    private function getFormDetails($input)
    {
        $data['leaveTypes'] = $this->leaveTypeRepository->getDropdown();
        $data['policyList'] = [
            config('leave_config.leave_policy.daily'),
            config('leave_config.leave_policy.monthly'),
            config('leave_config.leave_policy.yearly')
        ];
        $data['leaveGroupDetails'] = $this->leaveGroupDetailRepository->getDetailsByLeaveGroupId($input['leaveGroupId']);
        return $data;
    }

    public function store(Request $request)
    {
        $input = $request->only(['leaveGroupDetails', 'leaveGroupId']);
        $leavePolicies = [
            config('leave_config.leave_policy.daily'),
            config('leave_config.leave_policy.monthly'),
            config('leave_config.leave_policy.yearly'),
        ];
        $validator = Validator::make($input, [
            'leaveGroupId' => 'required|integer',
            'leaveGroupDetails' => 'required|array|min:1',
            'leaveGroupDetails.*.leaveTypeId' => 'required|integer',
            'leaveGroupDetails.*.policy' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($leavePolicies) {
                    if (!in_array($value, $leavePolicies)) {
                        $fail($attribute . ' must be one of: ' . implode(', ', $leavePolicies));
                    }
                },
            ],
            'leaveGroupDetails.*.noOfDays' => 'required|integer|min:1|max:100',
            'leaveGroupDetails.*.isCalendarDay' => 'required|in:0,1,string', // since you have "1" as string and 0 as int
            'leaveGroupDetails.*.maximumApplicableDays' => 'required|integer|min:1|max:100',
            'leaveGroupDetails.*.isAllowMinus' => 'required|in:0,1',
            'leaveGroupDetails.*.isCarryForward' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }
        try {
            if (!$this->leaveGroupRepository->isActiveAndExists($input['leaveGroupId'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave group details not found',
                ], 404);
            }
            $leaveTypeIds = [];
            $leaveGroupD = [];
            foreach ($input['leaveGroupDetails']   as $leaveGroupDetails) {
                $leaveTypeIds[] = $leaveGroupDetails['leaveTypeId'];
                if ($leaveGroupDetails['noOfDays'] < $leaveGroupDetails['maximumApplicableDays']) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Maximum applicable days can not be greater that no of days',
                    ], 404);
                }
                $leaveGroupD[] = [
                    'leave_group_id' => $input['leaveGroupId'],
                    'leave_type_id' => $leaveGroupDetails['leaveTypeId'],
                    'policy' => $leaveGroupDetails['policy'],
                    'no_of_days' => $leaveGroupDetails['noOfDays'],
                    'is_calendar_day' => $leaveGroupDetails['isCalendarDay'],
                    'maximum_applicable_days'  => $leaveGroupDetails['maximumApplicableDays'],
                    'is_allow_minus'  => $leaveGroupDetails['isAllowMinus'],
                    'is_carry_forward'  => $leaveGroupDetails['isCarryForward'],
                    'company_id' => Auth::user()->current_company_id
                ];
            }
            if (count($leaveTypeIds) != LeaveType::whereIn('id', $leaveTypeIds)->where('is_active', 1)->count()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave type details is invalid',
                ], 404);
            }
            DB::beginTransaction();
            $this->leaveGroupDetailRepository->permanantDeleteByGroupId($input['leaveGroupId']);
            $this->leaveGroupDetailRepository->insert($leaveGroupD);
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Leave group details update successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function adjustmentFormData(Request $request)
    {
        $input = $request->only(['leaveGroupID']);
        $validator = Validator::make($input, [
            'leaveGroupID' => 'required|integer'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }
        try {
            $employees = $this->userRepository->getUserByLeaveGroup($input['leaveGroupID']);
            $leaveTypes = $this->leaveGroupRepository->getLeaveTypeByGroupID($input['leaveGroupID']);
            $data = [
                'employees' => $employees,
                'leaveType' => $leaveTypes
            ];
            return response()->json([
                'success' => true,
                'data' => $data,
                'message' => 'Leave adjustment dara retrieved successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
