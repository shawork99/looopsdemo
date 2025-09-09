<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository
{
    public function __construct()
    {
        //
    }

    public function create(array $data)
    {
        return Supplier::create($data);
    }

    public function getAll($filter)
    {
        return Supplier::select(
                'id',
                'supplier_code',
                'person_name',
                'company_name',
                'email',
                'contact_number',
                'address',
                'business_register_number',
                'status'
            )
            ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
                $q->where(function ($q) use ($filter) {
                    $q->where('supplier_code', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('person_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('company_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('email', 'like', '%' . $filter['search'] . '%');
                });
            })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage'] ?? 10);
    }

    public function find($id)
    {
        return Supplier::select(
                'id',
                'supplier_code',
                'person_name',
                'company_name',
                'email',
                'contact_number',
                'address',
                'business_register_number',
                'status'
            )
            ->find($id);
    }

    public function update($id, array $data)
    {
        $supplier = Supplier::find($id);
        if ($supplier) {
            $supplier->update($data);
        }
        return $supplier;
    }

    public function delete($id)
    {
        $supplier = Supplier::find($id);
        if ($supplier) {
            $supplier->delete();
        }
    }

}
