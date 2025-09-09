<?php

namespace App\Repositories;

use App\Models\Designation;

class DesignationRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        Designation::create($data);
    }

    public function getAll($filter)
    {
        $designations = Designation::select(
            'id',
            'title',
            'description',
            'is_active'
        )
        ->withCount('users')
        ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
            $q->where(function ($q) use ($filter) {
                $q->where('title', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filter['search'] . '%');
            });
        })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
        
        $designations->getCollection()->transform(function ($designation) {
            if ($designation->users_count == 0) {
                $designation->users_count = 'N/A';
            } else {
                $designation->users_count = str_pad($designation->users_count, 2, '0', STR_PAD_LEFT);
            }
            return $designation;
        });

        return $designations;
    }

    public function isTitleExists($title)
    {
        return Designation::where('title', $title)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return Designation::where('is_active', 1)->where('id', $id)->exists();
    }


    public function find($id)
    {
        return Designation::select(
            'id',
            'title',
            'description',
            'is_active'
        )->find($id);
    }

    public function getRoleDropdown()
    {
        return Designation::select(
            'id',
            'title',
            'description'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
}
