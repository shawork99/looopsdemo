<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateRoleRequest;
use App\Models\Role;
use App\Models\User;
use App\Models\UserDetails;
use App\Repositories\RoleRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(
        protected RoleRepository $roleRepository
    ) {}

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
            'data' => $this->roleRepository->getAll($input),
            'message' => 'Role created successfully'
        ], 200);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->only([
            'name',
            'description',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'description' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $this->roleRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Role created successfully'
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
    public function update(Request $request, $roleId)
    {
        $input = $request->only([
            'name',
            'description',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'description' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $role = $this->roleRepository->find($roleId);
            if (empty($role)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role details not found',
                ], 404);
            }
            $role->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Role update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($roleId)
    {
        $role = $this->roleRepository->find($roleId);
        if (empty($role)) {
            return response()->json([
                'success' => false,
                'message' => 'Role details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Role retrieved successfully',
            'data' => $role
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($roleId)
    {
        $role = $this->roleRepository->find($roleId);
        if (empty($role)) {
            return response()->json([
                'success' => false,
                'message' => 'Role details not found',
            ], 404);
        }

        if (User::where('role_id', $roleId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This role already pulled to users',
            ], 404);
        }


        $role->delete();
        return response()->json([
            'success' => true,
            'message' => 'Role deleted successfully'
        ], 200);
    }
}
