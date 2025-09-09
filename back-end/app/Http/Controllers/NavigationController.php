<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Repositories\RoleRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class NavigationController extends Controller
{

    public function __construct(protected RoleRepository $roleRepository) {}


    public function index(Request $request)
    {
        if ($request->has('formdata')) {
            return response()->json([
                'success' => true,
                'data' => $this->formdata(),
                'message' => 'Role formdata retrieved successfully'
            ], 200);
        } else if ($request->has('getNavigationsByRoleId')) {
            $roleId = $request->get('getNavigationsByRoleId');
            if (empty($roleId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role id not found',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' =>  $this->getNavigationsByRole($roleId),
                'message' => 'Department created successfully'
            ], 200);
        }
    }

    private function formdata()
    {
        $data['roles'] = $this->roleRepository->getRoleDropdown();
        return $data;
    }

    private function getNavigationsByRole($roleId)
    {
        $role = Role::select(
            'navigations',
            'permissions',
        )->where('is_active', 1)->find($roleId);
        if (empty($role)) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }
        $navigation = config('navigation');

        return [
            'role' => $role,
            'navigations' => $navigation['navigation'],
            'permissions' => $navigation['permissions']
        ];
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'navigationKeys',
            'permissionKeys',
            'roleId'
        ]);

        $validator = Validator::make($input, [
            'navigationKeys' => 'required|array|min:1',
            'permissionKeys' => 'required|array|min:1',
            'roleId' => 'required|integer',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }
        $role = $this->roleRepository->find($input['roleId']);
        if (empty($role)) {
            return response()->json([
                'success' => false,
                'message' => 'Role not found',
            ], 404);
        }
        try {
            $navigationConfig = config('navigation');
            $navigations = $navigationConfig['navigation'];
            $permissions = $navigationConfig['permissions'];
            $selectedNavigations = json_encode($input['navigationKeys']);
            $selectedPermissions = json_encode($input['permissionKeys']);
            $navs = [];
            foreach ($navigations as $navigation) {
                $mainNav = [];
                if (isset($navigation['isTitle']) && $navigation['isTitle'] == true) {
                    $mainNav = $navigation;
                } else {
                    if (Str::contains($selectedNavigations, $navigation['key'])) {
                        $mainNav = $navigation;
                        $mainNav['children'] = [];
                        if (isset($navigation['children'])) {
                            foreach ($navigation['children'] as $childNav) {
                                if (Str::contains($selectedNavigations, $childNav['key'])) {
                                    $mainNav['children'][] = $childNav;
                                }
                            }
                        }
                    }
                }
                $navs[] =  $mainNav;
            }
            $per = [];
            foreach ($permissions as $permission) {
                if (Str::contains($selectedPermissions, $permission['permission_name'])) {
                    $per[] = $permission;
                }
            }
            $role->update([
                'navigations' => $navs,
                'permissions' => $per
            ]);
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
}
