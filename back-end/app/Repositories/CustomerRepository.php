<?php

namespace App\Repositories;

use App\Models\Customer;

class CustomerRepository
{
    public function __construct()
    {
        //
    }

    public function create($data)
    {
        return Customer::create($data);
    }

    public function getAll($filter)
    {
        return Customer::select(
                'id',
                'customer_code',
                'person_name',
                'company_name',
                'email',
                'contact_number',
                'status',
                'business_registration_no',
                'address',
                'currency_id'
            )
            ->with('currency')
            ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
                $q->where(function ($q) use ($filter) {
                    $q->where('customer_code', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('person_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('company_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('email', 'like', '%' . $filter['search'] . '%');
                });
            })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage'] ?? 10);
    }

    public function find($customerId)
    {
        return Customer::select(
                'id',
                'customer_code',
                'person_name',
                'company_name',
                'email',
                'contact_number',
                'address',
                'currency_id',
                'business_registration_no',
                'status'
            )
            ->with('currency')
            ->find($customerId);
    }

    public function update($customerId, $data)
    {
        $customer = Customer::find($customerId);
        if ($customer) {
            $customer->update($data);
        }
        return $customer;
    }

    public function delete($customerId)
    {
        $customer = Customer::find($customerId);
        if ($customer) {
            $customer->delete();
        }
    }

    public function isCodeExists($customerCode)
    {
        return Customer::where('customer_code', $customerCode)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return Customer::where('status', 'active')->where('id', $id)->exists();
    }

    public function getDropdownList()
    {
        return Customer::select('id', 'customer_code', 'company_name')
            ->where('status', 'active')
            ->orderBy('company_name')
            ->get();
    }
}
