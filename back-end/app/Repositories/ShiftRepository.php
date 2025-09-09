<?php

namespace App\Repositories;

use App\Models\Shift;

class ShiftRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        return Shift::create($data);
    }

    public function getAll($filter)
    {
        return Shift::select(
            'id',
            'code',
            'name',
            'is_active'
        )->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
            $q->where(function ($q) use ($filter) {
                $q->where('code', 'like', '%' . $filter['search'] . '%')
                    ->orWhere('name', 'like', '%' . $filter['search'] . '%');
            });
        })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
    }

    public function isCodeExists($code)
    {
        return Shift::where('code', $code)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return Shift::where('is_active', 1)->where('id', $id)->exists();
    }


    public function find($id)
    {
        return Shift::select(
            'id',
            'code',
            'name',
            'is_active'
        )->with([
            'shiftDetails' => function ($q) {
                $q->select(
                    'id',
                    'shift_id',
                    'day_name',
                    'start_time',
                    'end_time',
                    'grace_time',
                    'work_hours',
                    'work_hours_minute',
                    'is_week_day'
                );
            }
        ])->find($id);
    }

    public function getDropdown($filter = null)
    {
        return Shift::select(
            'id',
            'code',
            'name'
        )->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }


    public function exists($id): bool
    {
        return Shift::exists($id);
    }
}
