<?php

namespace App\Repositories;

use App\Models\LeaveAdjustmentEmployee;
use App\Models\LeaveAdjustmentHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LeaveAdjustmentHistoryRepository
{
    public function create(array $data)
    {
        try {
            return DB::transaction(function () use ($data) {
                LeaveAdjustmentHistory::create($data);
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
    public function leaveHistoty($leaveAdjustmentID)
    {
        $leaveAdjustmentDetails = LeaveAdjustmentEmployee::where('leave_adjustment_id', $leaveAdjustmentID)->get();
        foreach ($leaveAdjustmentDetails as $details) {
            $data = [
                'employee_id' => $details->employee_id,
                'leave_type_id' => $details->leave_type_id,
                'change_amount' => $details->adjusted_balance,
                'balance_before' => $details->previous_balance,
                'balance_after' => $details->new_balance,
                'reason' => $details->remarks ?? null,
                'source_id' => 1,
                'source_name' => 'LA',
                'adjusted_by' => Auth::user()->id,
                'adjusted_at' => now()
            ];

            $create = self::create($data);
            if (!$create['success']) {
                return [
                    'success' => false,
                    'message' => $create['message']
                ];
            }
        }
        return [
            'success' => true,
            'message' => 'Leave adjustment history created'
        ];
    }
}
