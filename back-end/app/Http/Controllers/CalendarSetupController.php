<?php

namespace App\Http\Controllers;

use App\Repositories\CalendarSetupRespository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class CalendarSetupController extends Controller
{
    protected $calendarSetupRepository;

    public function __construct(CalendarSetupRespository $calendarSetupRepo){
        $this->calendarSetupRepository = $calendarSetupRepo;
    }

    public function index(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $this->calendarSetupRepository->getAll(),
            'message' => 'Approval level dara retrieved successfully'
        ], 200);
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'title',
            'date',
            'event_type'
        ]);
        try {
            $validator = Validator::make($input, [
                'title' => 'required|max:50',
                'date' => 'required|date',
                'event_type' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $eventType = $input['event_type'] ?? null;

            if ($eventType === "hoilday") {
                $existingHoliday = $this->calendarSetupRepository->checkHolidayExistsForSameDay($input);
                if ($existingHoliday) {
                    return response()->json([
                        'success' => false,
                        'message' => 'A holiday is already scheduled on this date.',
                    ], 400);
                }
            }

            if (Carbon::parse($input['date'])->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot create a calendar entry in the past.',
                ], 400);
            }

            $insertData = [
                'title' => $input['title'],
                'date' => $input['date'],
                'event_type' => $input['event_type']
            ];

            $create = $this->calendarSetupRepository->create($insertData);
            if(!$create['success']){
                return response()->json([
                    'success' => false,
                    'message' => $create['message'] ?? 'Unable to create calendar setup.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Calendar setup created successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function show($id)
    {
        $calendarSetup = $this->calendarSetupRepository->find($id);
        if (empty($calendarSetup)) {
            return response()->json([
                'success' => false,
                'message' => 'Calendar setup details not found',
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $calendarSetup,
            'message' => 'Calendar setup details retrived successfully'
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $input = $request->only([
            'title',
            'date',
            'event_type'
        ]);
        try{
            $validator = Validator::make($input, [
                'title' => 'required|max:50',
                'date' => 'required|date',
                'event_type' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $eventType = $input['event_type'] ?? null;

            if ($eventType === "hoilday") {
                $existingHoliday = $this->calendarSetupRepository->checkHolidayExistsForSameDay($input, $id);
                if ($existingHoliday) {
                    return response()->json([
                        'success' => false,
                        'message' => 'A holiday is already scheduled on this date.',
                    ], 400);
                }
            }

            if (Carbon::parse($input['date'])->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot edit a calendar entry in the past.',
                ], 400);
            }

            $update = $this->calendarSetupRepository->update($id, $input);
            if(!$update['success']){
                return response()->json([
                    'success' => false,
                    'message' => $create['message'] ?? 'Unable to update calendar setup.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Calendar setup updated successfully'
            ], 200);
        } catch (\Exception $ex){
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }

    public function destroy($id)
    {
        $calendarSetup = $this->calendarSetupRepository->find($id);
        if(empty($calendarSetup)){
            return response()->json([
                'success' => false,
                'message' => 'Calendar setup not found',
            ], 404);
        }

        if (Carbon::parse($calendarSetup->date)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete a calendar setup scheduled in the past.',
            ], 400);
        }

        try{
            $calendarSetupDelete = $this->calendarSetupRepository->delete($id);
            if(!$calendarSetupDelete['success']){
                return response()->json([
                    'success' => false,
                    'message' => $approvlDelete['message'] ?? 'Unable to delete calendar setup.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Calendar setup deleted successfully'
            ], 200);
        } catch (\Exception $ex){
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }
}
