<?php

namespace App\Repositories;

use App\Models\Department;

class DepartmentRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        Department::create($data);
    }

    public function getAll($filter)
    {
        $departments = Department::select(
            'id',
            'code',
            'name',
            'is_active'
        )->withCount('users')
        ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
            $q->where(function ($q) use ($filter) {
                $q->where('name', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('code', 'like', '%' . $filter['search'] . '%');
            });
        })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
        
        $departments->getCollection()->transform(function ($department) {
            if ($department->users_count == 0) {
                $department->users_count = 'N/A';
            } else {
                $department->users_count = str_pad($department->users_count, 2, '0', STR_PAD_LEFT);
            }
            return $department;
        });

        return $departments;
    }

    public function isCodeExists($depratmentCode)
    {
        return Department::where('code', $depratmentCode)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return Department::where('is_active', 1)->where('id', $id)->exists();
    }

    public function find($depratmentId)
    {
        return Department::select(
            'id',
            'code',
            'name',
            'is_active'
        )->find($depratmentId);
    }

    public function getRoleDropdown()
    {
        return Department::select(
            'id',
            'code',
            'name'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
}
