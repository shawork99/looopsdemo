<?php

namespace App\Repositories;

use App\Models\LeaveGroupDetail;

class LeaveGroupDetailRepository
{
    public function insert($data)
    {
        LeaveGroupDetail::insert($data);
    }

    public function permanantDeleteByGroupId($leaveGroupId)
    {

        LeaveGroupDetail::where('leave_group_id', $leaveGroupId)->forceDelete();
    }

    public function getDetailsByLeaveGroupId($leaveGroupId)
    {
        return LeaveGroupDetail::select(
            'id',
            'leave_group_id',
            'leave_type_id',
            'policy',
            'no_of_days',
            'is_calendar_day',
            'maximum_applicable_days',
            'is_allow_minus',
            'is_carry_forward',
        )->with('leaveType:id,code,name')->where('leave_group_id', $leaveGroupId)->get();
    }
}
