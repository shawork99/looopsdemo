<?php

namespace App\Http\Controllers;

use App\Models\UserDetails;
use App\Repositories\DepartmentRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Exception;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected DepartmentRepository $departmentRepository) {}

    public function index(Request $request)
    {
        $input = $request->only([
            'search',
            'perPage',
            'page'
        ]);

        $validator = Validator::make($input, [
            'search' => 'max:50',
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
            'data' => $this->departmentRepository->getAll($input),
            'message' => 'Department created successfully'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->only([
            'name',
            'code',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'code' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            if ($this->departmentRepository->isCodeExists($input['code'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department code is already exists',
                ], 400);
            }
            $this->departmentRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Department created successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $departmentId)
    {
        $input = $request->only([
            'name',
            'code',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'code' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $department = $this->departmentRepository->find($departmentId);
            if (empty($department)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department details not found',
                ], 404);
            }
            $department->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Department update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($departmentId)
    {
        $department = $this->departmentRepository->find($departmentId);
        if (empty($department)) {
            return response()->json([
                'success' => false,
                'message' => 'Department details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Department retrieved successfully',
            'data' => $department
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($departmentId)
    {
        $department = $this->departmentRepository->find($departmentId);
        if (empty($department)) {
            return response()->json([
                'success' => false,
                'message' => 'Department details not found',
            ], 404);
        }
        if (UserDetails::where('department_id', $departmentId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Department already pulled to users',
            ], 404);
        }
        $department->delete();
        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully'
        ], 200);
    }
}
