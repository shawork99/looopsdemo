<?php

namespace App\Repositories;

use App\Models\RequestStatus;

class RequestStatusRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        RequestStatus::create($data);
    }

    public function getAll($filter)
    {
        return RequestStatus::select(
            'id',
            'code',
            'name',
            'sort_order',
            'background_color',
            'based_type',
            'request_type_id',
            'is_active'
        )->where('request_type_id', $filter['requestTypeId'])
            ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
                $q->where(function ($q) use ($filter) {
                    $q->where('code', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('name', 'like', '%' . $filter['search'] . '%');
                });
            })
            ->orderBy('sort_order', 'ASC')
            ->paginate($filter['perPage']);
    }

    public function find($id, $requestTypeId = null)
    {
        return RequestStatus::select(
            'id',
            'code',
            'name',
            'sort_order',
            'background_color',
            'based_type',
            'request_type_id',
            'is_active'
        )->when(isset($requestTypeId), function ($q) use ($requestTypeId) {
            $q->where('request_type_id', $requestTypeId);
        })->find($id);
    }
}
