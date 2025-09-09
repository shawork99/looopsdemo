<?php

namespace App\Http\Controllers;

use App\Repositories\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class CustomerController extends Controller
{
    public function __construct(protected CustomerRepository $customerRepository) {}

    public function index(Request $request)
    {
        $input = $request->only([
            'search',
            'perPage',
            'page'
        ]);

        $validator = Validator::make($input, [
            'search' => 'nullable|max:50',
            'perPage' => 'required|integer',
            'page' => 'required|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->customerRepository->getAll($input),
            'message' => 'Customer list retrieved successfully'
        ], 200);
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'customer_code',
            'person_name',
            'company_name',
            'email',
            'contact_number',
            'address',
            'business_registration_no',
            'status'
        ]);

        try {
            $validator = Validator::make($input, [
                'customer_code' => 'required|unique:customers',
                'person_name' => 'required|max:100',
                'company_name' => 'required|max:100',
                'email' => 'required|email|unique:customers',
                'contact_number' => 'required|max:20',
                'address' => 'required|max:255',
                'business_registration_no' => 'required|max:50',
                'status' => 'required|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            $input['currency_id'] = 1;
            $this->customerRepository->create($input);

            return response()->json([
                'success' => true,
                'message' => 'Customer created successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, $customerId)
    {
        $input = $request->only([
            'person_name',
            'company_name',
            'email',
            'contact_number',
            'address',
            'business_registration_no',
            'status'
        ]);

        try {
            $validator = Validator::make($input, [
                'person_name' => 'required|max:100',
                'company_name' => 'required|max:100',
                'email' => "required|email|unique:customers,email,$customerId",
                'contact_number' => 'required|max:20',
                'address' => 'required|max:255',
                'business_registration_no' => 'required|max:50',
                'status' => 'required|in:active,inactive',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            $customer = $this->customerRepository->find($customerId);

            if (empty($customer)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Customer not found',
                ], 404);
            }
            $input['currency_id'] = 1;
            $customer->update($input);

            return response()->json([
                'success' => true,
                'message' => 'Customer updated successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($customerId)
    {
        $customer = $this->customerRepository->find($customerId);

        if (empty($customer)) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $customer,
            'message' => 'Customer retrieved successfully'
        ], 200);
    }

    public function destroy($customerId)
    {
        $customer = $this->customerRepository->find($customerId);

        if (empty($customer)) {
            return response()->json([
                'success' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer deleted successfully'
        ], 200);
    }
}
