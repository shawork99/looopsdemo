<?php

namespace App\Repositories;

use App\Models\LeaveGroup;
use App\Models\LeaveGroupDetail;

class LeaveGroupRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        LeaveGroup::create($data);
    }

    public function getAll($filter)
    {
        return LeaveGroup::select(
            'id',
            'code',
            'name',
            'is_active'
        )->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
            $q->where(function ($q) use ($filter) {
                $q->where('name', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('code', 'like', '%' . $filter['search'] . '%');
            });
        })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
    }

    public function find($id)
    {
        return LeaveGroup::select(
            'id',
            'code',
            'name',
            'is_active'
        )->find($id);
    }

    public function isCodeExists($code)
    {
        return LeaveGroup::where('code', $code)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return LeaveGroup::where('is_active', 1)->where('id', $id)->exists();
    }

    public function getDropdown()
    {
        return LeaveGroup::select(
            'id',
            'code',
            'name'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
    public function getLeaveTypeByGroupID($leaveGroupID)
    {
        return LeaveGroupDetail::select('id', 'leave_group_id', 'leave_type_id')
            ->with([
                'leaveType' => function ($q) use ($leaveGroupID) {
                    $q->select('id', 'name')->where('is_active', 1);
                }
            ])
            ->whereHas('leaveType', function ($q) {
                $q->where('is_active', 1);
            })->where('leave_group_id', $leaveGroupID)
            ->orderBy('leave_type_id', 'ASC')
            ->get()
            ->map(function ($detail) {
                return [
                    'id' => $detail->leaveType->id,
                    'name' => $detail->leaveType->name
                ];
            });
    }
}
