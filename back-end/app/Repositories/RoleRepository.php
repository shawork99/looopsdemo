<?php

namespace App\Repositories;

use App\Models\Role;

class RoleRepository
{

    public function create($data)
    {
        Role::create($data);
    }

    public function getAll($filter)
    {
        $roles =  Role::select(
            'id',
            'name',
            'description',
            'is_admin',
            'is_active'
        )->withCount('users')
        ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
            $q->where(function ($q) use ($filter) {
                $q->where('name', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filter['search'] . '%');
            });
        })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
        
        $roles->getCollection()->transform(function ($role) {
            if ($role->users_count == 0) {
                $role->users_count = 'N/A';
            } else {
                $role->users_count = str_pad($role->users_count, 2, '0', STR_PAD_LEFT);
            }
            return $role;
        });

        return $roles;
    }

    public function find($roleId)
    {
        return Role::select(
            'id',
            'name',
            'description',
            'is_admin',
            'is_active'
        )->find($roleId);
    }

    public function exists($roleId): bool
    {
        return Role::exists($roleId);
    }

    public function isActiveAndExists($id): bool
    {
        return Role::where('is_active', 1)->where('id',$id)->exists();
    }

    public function getRoleDropdown()
    {
        return Role::select(
            'id',
            'name',
            'description',
            'is_active'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
}
