<?php

namespace App\Repositories;

use App\Models\ShiftDetail;

class ShiftDetailRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        return ShiftDetail::create($data);
    }

    public function insert(array $data)
    {
        return ShiftDetail::insert($data);
    }

    public function deleteDetails($shiftId)
    {
        ShiftDetail::where('shift_id', $shiftId)->forceDelete();
    }
}
