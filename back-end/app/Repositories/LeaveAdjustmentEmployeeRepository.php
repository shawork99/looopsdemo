<?php

namespace App\Repositories;

use App\Models\LeaveAdjustment;
use App\Models\LeaveAdjustmentEmployee;
use App\Models\LeaveAdjustmentHistory;
use App\Models\LeaveGroupDetail;
use App\Models\LeaveType;
use Illuminate\Support\Facades\DB;

class LeaveAdjustmentEmployeeRepository
{
    public function create(array $data)
    {
        try {
            return DB::transaction(function () use ($data) {
                LeaveAdjustmentEmployee::create($data);
                return [
                    'success' => true,
                    'message' => 'Successfully created'
                ];
            });
        } catch (\Exception $ex) {
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function getAdjustmentDetails($leaveAdjustmentId)
    {
        $leaveAdjustment = LeaveAdjustment::find($leaveAdjustmentId);
        if (empty($leaveAdjustment)) {
            return ['success' => false, 'message' => 'Leave Adjustment not found'];
        }

        $leaveTypes = LeaveAdjustmentEmployee::with('leaveType:id,name')
            ->where('leave_adjustment_id', $leaveAdjustmentId)
            ->get()
            ->pluck('leaveType')
            ->unique('id')
            ->values();

        $leaveGroupDays = LeaveGroupDetail::where('leave_group_id', $leaveAdjustment->leave_group_id)
            ->pluck('no_of_days', 'leave_type_id');

        $employees = LeaveAdjustmentEmployee::with([
            'employee:id,first_name,last_name',
            'leaveType:id,name'
        ])
            ->where('leave_adjustment_id', $leaveAdjustmentId)
            ->get();

        $employeeIds = $employees->pluck('employee_id')->unique();
        $latestBalances = LeaveAdjustmentHistory::whereIn('employee_id', $employeeIds)
            ->selectRaw('MAX(id) as latest_id')
            ->groupBy('employee_id', 'leave_type_id')
            ->pluck('latest_id');

        $historyBalances = LeaveAdjustmentHistory::whereIn('id', $latestBalances)
            ->get()
            ->groupBy('leave_type_id')
            ->map(function ($rows) {
                return $rows->sortByDesc('id')->first()->balance_after;
            });

        $leaveTypes = $leaveTypes->map(function ($leaveType) use ($leaveGroupDays, $historyBalances) {
            if (isset($historyBalances[$leaveType->id])) {
                $leaveType->no_of_days = (float) $historyBalances[$leaveType->id];
            } else {
                $leaveType->no_of_days = (float) ($leaveGroupDays[$leaveType->id] ?? 0);
            }
            return $leaveType;
        });

        $data = [
            'leave_types' => $leaveTypes,
            'items'       => $employees
        ];

        return [
            'success' => true,
            'message' => 'Leave adjustment details retrieved successfully',
            'data'    => $data
        ];
    }

    public function findLeaveAdjustmentEmployee($leaveAdjustmentId, $employeeID)
    {
        return LeaveAdjustmentEmployee::where('leave_adjustment_id', $leaveAdjustmentId)->where('employee_id', $employeeID)->first();
    }
    public function delete($leaveAdjustmentId, $employeeID)
    {
        try {
            LeaveAdjustmentEmployee::where('leave_adjustment_id', $leaveAdjustmentId)->where('employee_id', $employeeID)->delete();
            return [
                'success' => true,
                'message' => 'Deleted successfully'
            ];
        } catch (\Exception $ex) {
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }
}
