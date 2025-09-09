<?php

namespace App\Http\Controllers;

use App\Repositories\SupplierRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class SupplierController extends Controller
{
    public function __construct(protected SupplierRepository $supplierRepository) {}

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
            'data' => $this->supplierRepository->getAll($input),
            'message' => 'Supplier list retrieved successfully'
        ], 200);
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'supplier_code',
            'person_name',
            'company_name',
            'email',
            'contact_number',
            'address',
            'business_register_number',
            'status'
        ]);

        try {
            $validator = Validator::make($input, [
                'supplier_code' => 'required|unique:suppliers,supplier_code',
                'person_name' => 'required|string|max:150',
                'company_name' => 'required|string|max:200',
                'email' => 'nullable|email|unique:suppliers,email',
                'contact_number' => 'nullable|max:20',
                'address' => 'nullable|max:255',
                'business_register_number' => 'nullable|max:50',
                'status' => 'required|in:1,0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            $supplier = $this->supplierRepository->create($input);

            return response()->json([
                'success' => true,
                'data' => $supplier,
                'message' => 'Supplier created successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, $supplierId)
    {
        $input = $request->only([
            'supplier_code',
            'person_name',
            'company_name',
            'email',
            'contact_number',
            'address',
            'business_register_number',
            'status'
        ]);

        try {
            $validator = Validator::make($input, [
                'supplier_code' => "required|unique:suppliers,supplier_code,$supplierId",
                'person_name' => 'required|string|max:150',
                'company_name' => 'required|string|max:200',
                'email' => "nullable|email|unique:suppliers,email,$supplierId",
                'contact_number' => 'nullable|max:20',
                'address' => 'nullable|max:255',
                'business_register_number' => 'nullable|max:50',
                'status' => 'required|in:1,0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            $supplier = $this->supplierRepository->find($supplierId);

            if (empty($supplier)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Supplier not found',
                ], 404);
            }

            $supplier->update($input);

            return response()->json([
                'success' => true,
                'data' => $supplier,
                'message' => 'Supplier updated successfully'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($supplierId)
    {
        $supplier = $this->supplierRepository->find($supplierId);

        if (empty($supplier)) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $supplier,
            'message' => 'Supplier retrieved successfully'
        ], 200);
    }

    public function destroy($supplierId)
    {
        $supplier = $this->supplierRepository->find($supplierId);

        if (empty($supplier)) {
            return response()->json([
                'success' => false,
                'message' => 'Supplier not found',
            ], 404);
        }

        $supplier->delete();

        return response()->json([
            'success' => true,
            'message' => 'Supplier deleted successfully'
        ], 200);
    }
}
