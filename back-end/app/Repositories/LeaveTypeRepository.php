<?php

namespace App\Repositories;

use App\Models\LeaveType;

class LeaveTypeRepository
{
    public function create($data)
    {
        LeaveType::create($data);
    }

    public function getAll($filter)
    {
        return LeaveType::select(
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

    public function isCodeExists($code)
    {
        return LeaveType::where('code', $code)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return LeaveType::where('is_active', 1)->where('id', $id)->exists();
    }

    public function find($id)
    {
        return LeaveType::select(
            'id',
            'code',
            'name',
            'is_active'
        )->find($id);
    }

    public function getDropdown()
    {
        return LeaveType::select(
            'id',
            'code',
            'name'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
}
