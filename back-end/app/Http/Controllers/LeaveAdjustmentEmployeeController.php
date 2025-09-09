<?php

namespace App\Http\Controllers;

use App\Models\LeaveAdjustment;
use App\Models\LeaveGroupDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Repositories\LeaveAdjustmentEmployeeRepository;
use App\Repositories\LeaveAdjustmentHistoryRepository;
use App\Models\LeaveAdjustmentEmployee;
use App\Models\LeaveAdjustmentHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LeaveAdjustmentEmployeeController extends Controller
{
    public function __construct(
        protected LeaveAdjustmentEmployeeRepository $leaveAdjustmentEmployeeRepository,
        protected LeaveAdjustmentHistoryRepository $leaveAdjustmentHistoryRepository
    ) {}

    public function index($leaveAdjustmentID)
    {
        $responseData = $this->leaveAdjustmentEmployeeRepository->getAdjustmentDetails($leaveAdjustmentID);
        if (!$responseData['success']) {
            return response()->json([
                'success' => false,
                'message' => $responseData['message'] ?? 'Unable to retrive data',
            ], 500);
        }
        return response()->json([
            'success' => true,
            'data' => $responseData['data'] ?? [],
            'message' => 'Leave adjustment details retrieved successfully.',
        ], 200);
    }
    public function store(Request $request)
    {
        $input = $request->only([
            'employees',
            'leave_adjustment_id',
            'leave_group_id',
            'leave_types'
        ]);

        try {
            $validator = Validator::make($input, [
                'employees' => 'required|array',
                'leave_adjustment_id' => 'required|integer',
                'leave_group_id' => 'required|integer',
                'leave_types' => 'required|array'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $createdAny = false;
            foreach ($input['employees'] as $employeeId) {
                foreach ($input['leave_types'] as $leaveTypeId) {
                    $alreadyExists = LeaveAdjustmentEmployee::where([
                        'leave_adjustment_id' => $input['leave_adjustment_id'],
                        'employee_id'         => $employeeId,
                        'leave_type_id'       => $leaveTypeId,
                    ])->exists();

                    if ($alreadyExists) {
                        continue;
                    }

                    $leaveHistory = LeaveAdjustmentHistory::where([
                        'employee_id' => $employeeId,
                        'leave_type_id' => $leaveTypeId,
                    ])->orderBy('id', 'desc')->first();

                    if (!$leaveHistory) {
                        $leaveGroupDetail = LeaveGroupDetail::select('id', 'no_of_days')
                            ->where('leave_group_id', $input['leave_group_id'])
                            ->where('leave_type_id', $leaveTypeId)
                            ->first();

                        if (!$leaveGroupDetail) {
                            return response()->json([
                                'success' => false,
                                'message' => "Leave group details not found for leave type {$leaveTypeId}",
                            ], 400);
                        }

                        $previous = (float) $leaveGroupDetail->no_of_days ?? 0;
                        $new = $previous;
                        $adjusted_balance = 0;
                    } else {
                        $previous = (float) $leaveHistory->balance_after ?? 0;
                        $new = (float) $leaveHistory->balance_after ?? 0;;
                        $adjusted_balance = 0;
                    }

                    $records = [
                        'leave_adjustment_id' => $input['leave_adjustment_id'],
                        'employee_id'         => $employeeId,
                        'leave_type_id'       => $leaveTypeId,
                        'previous_balance'    => $previous,
                        'adjusted_balance'    => $adjusted_balance,
                        'new_balance'         => $new,
                        'created_at'          => now(),
                        'updated_at'          => now(),
                    ];

                    $createLAEmployees = $this->leaveAdjustmentEmployeeRepository->create($records);
                    if (!$createLAEmployees['success']) {
                        return response()->json([
                            'success' => false,
                            'message' => $createLAEmployees['message'],
                        ], 400);
                    }

                    $createdAny = true;
                }
            }

            if ($createdAny) {
                return response()->json([
                    'success' => true,
                    'message' => 'Leave adjustment employee(s) assigned successfully',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'No new employees or leave types were assigned (already exists)',
            ], 400);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }

    public function show() {}
    public function update($id, Request $request)
    {
        // Validate main adjustment exists
        $adjustment = LeaveAdjustment::find($id);
        if (!$adjustment) {
            return response()->json(['message' => 'Leave adjustment not found'], 404);
        }

        $data = $request->validate([
            'rows' => 'required|array',
            'rows.*.id' => 'required|integer|exists:leave_ajustment_employees,id',
            'rows.*.employee_id' => 'required|integer',
            'rows.*.leave_type_id' => 'required|integer',
            'rows.*.adjusted_balance' => 'required|min:0',
            'rows.*.remarks' => 'nullable|string|max:200'
        ]);

        DB::beginTransaction();
        try {
            foreach ($data['rows'] as $row) {
                $empRow = LeaveAdjustmentEmployee::find($row['id']);
                if (!$empRow) {
                    continue; // or throw error
                }

                $balanceBefore = $empRow->new_balance; // current stored balance
                $newBalance = $row['adjusted_balance'];
                $diff = $newBalance - $balanceBefore;

                // Update the employee leave balance
                $empRow->new_balance = $newBalance;
                $empRow->previous_balance = $balanceBefore;
                $empRow->adjusted_balance = $diff;
                $empRow->remarks = $row['remarks'] ?? null;
                $empRow->save();
            }

            DB::commit();
            return response()->json(['message' => 'Leave adjustment updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error updating leave adjustment', 'error' => $e->getMessage()], 500);
        }
    }

    public function deleteEmployeeLeaveAdjustment(Request $request)
    {
        $input = $request->only([
            'leave_adjustment_id',
            'employee_id'
        ]);

        $data = $request->validate([
            'leave_adjustment_id' => 'required|integer',
            'employee_id' => 'required|integer',
        ]);

        $leaveAdjustmentEmployee = $this->leaveAdjustmentEmployeeRepository->findLeaveAdjustmentEmployee($input['leave_adjustment_id'], $input['employee_id']);
        if (empty($leaveAdjustmentEmployee)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave adjustment employee detail not found',
            ], 404);
        }
        try {
            return DB::transaction(function () use ($input) {
                $deleteRecord = $this->leaveAdjustmentEmployeeRepository->delete($input['leave_adjustment_id'], $input['employee_id']);
                if (!$deleteRecord['success']) {
                    return response()->json([
                        'success' => false,
                        'message' => $deleteRecord['message'] ?? 'Unable to delete leave adjustment employee detail.',
                    ], 400);
                }

                return response()->json([
                    'success' => false,
                    'message' => 'Deleted successfully',
                ], 200);
            });
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage(),
            ], 500);
        }
    }
}
