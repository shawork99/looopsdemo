<?php

namespace App\Repositories;

use App\Models\Role;
use App\Models\Scopes\CurrentCompanyScope;
use App\Models\User;
use App\Models\UserDetails;
use App\Services\TenantHelperService;
use App\Traits\FileUploadTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use \App\Models\Company;

class UserRepository
{
    use FileUploadTrait;

    public function __construct(protected TenantHelperService $tenantHelperService) {}

    public function create($data)
    {
        $employeeCodeId = UserDetails::max('employee_code_id') + 1;
        $companyCode =Company::where('id', Auth::user()->current_company_id)->value('company_code'); 
            
        $userD = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'role_id' => $data['role_id'],
            'email' => $data['email'],
            'is_active'  => $data['is_active'],
            'password' =>   Hash::make($data['password']),
            'base_company_id' => Auth::user()->current_company_id,
            'current_company_id'  => Auth::user()->current_company_id,
            'created_by' => Auth::id(),
            'tenant_id' => $this->tenantHelperService->getActiveTenant()
        ];

        $user = User::create($userD);
        UserDetails::create([
            'employee_code' => $companyCode .'/EMP/000' . $employeeCodeId,
            'employee_code_id' => $employeeCodeId,
            'user_id' => $user->id,
            'department_id' => $data['department_id'],
            'designation_id' => $data['designation_id'],
            'gender' => $data['gender']
        ]);
        $userD['tenant_user_id'] = $user->id;
        DB::commit();
        tenancy()->central(function () use ($userD) {
            //create records in main database
            User::create($userD);
        });
    }

    public function update($data, $userId)
    {
        $user = User::where('id', $userId)->first();
        if (empty($user)) {
            abort(404, 'User details not found');
        }
        $userD = [
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'role_id' => $data['role_id'],
            'email' => $data['email'],
            'is_active'  => $data['is_active'],
            'calling_name' => isset($data['calling_name']) ? $data['calling_name'] : null,
            'is_discharged' => isset($data['is_discharged']) ? $data['is_discharged'] : false
        ];
        $user->update($userD);
        $userDetails = DB::table('user_details')->select('profile_image')->where('user_id', $userId)->first();
        $profileImagePath = $userDetails->profile_image;
        $udata = [
            'department_id' => $data['department_id'],
            'designation_id' => $data['designation_id'],
            'address' => isset($data['address']) ? $data['address'] : null,
            'contact_no' => isset($data['contact_no']) ? $data['contact_no'] : null,
            'country' => isset($data['country']) ? $data['country'] : null,
            'date_of_joined' => isset($data['date_of_joined']) ? $data['date_of_joined'] : null,
            'employee_code_reference' => isset($data['employee_code_reference']) ? $data['employee_code_reference'] : null,
            'id_number' => isset($data['id_number']) ? $data['id_number'] : null,
            'reporting_manager_id' => isset($data['reporting_manager_id']) ? $data['reporting_manager_id'] : null,
            'shift_id' => isset($data['shift_id']) ? $data['shift_id'] : null,
            'shift' => isset($data['shift']) ? $data['shift'] : null,
            'department' => isset($data['department']) ? $data['department'] : null,
            'designation' => isset($data['designation']) ? $data['designation'] : null,
            'profile_image' => isset($data['profile_image'], $data['profile_image']['path']) ? $data['profile_image']['path'] : $profileImagePath,
            'leave_group_id' => isset($data['leave_group_id']) ? $data['leave_group_id'] : null,
            'location_id' => isset($data['location_id']) ? $data['location_id'] : null,
            'contact_number_office' => isset($data['contact_number_office']) ? $data['contact_number_office'] : null,
            'date_of_birth' => isset($data['date_of_birth']) ? $data['date_of_birth'] : null,
            'gender' => isset($data['gender']) ? $data['gender'] : null
        ];
        UserDetails::where('user_id', $userId)->update($udata);
        if (isset($data['profile_image']['path']) && !empty($profileImagePath)) {
            $this->deleteFile($profileImagePath);
        }
        DB::commit();
        tenancy()->central(function () use ($userD, $userId) {
            //create records in main database
            User::where('tenant_user_id', $userId)->update($userD);
        });
    }


    public function getAll($filter)
    {
        $adminRoleId = Role::select('id')->withoutGlobalScopes()->where('is_admin', true)->first();
        return User::select(
            'id',
            'first_name',
            'last_name',
            'email',
            'role_id',
            'is_active',
        )->where('role_id', '!=', $adminRoleId->id)
            ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
                $q->where(function ($q) use ($filter) {
                    $q->where('first_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('last_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('email', 'like', '%' . $filter['search'] . '%');
                });
            })
             ->when(!empty($filter['department_id']) || !empty($filter['designation_id']) || !empty($filter['manager_id']) || !empty($filter['location_id']), function($q) use ($filter) {
                $q->whereHas('details', function($q) use ($filter) {
                    if (!empty($filter['department_id'])) {
                        $q->where('department_id', $filter['department_id']);
                    }
                    if (!empty($filter['designation_id'])) {
                        $q->where('designation_id', $filter['designation_id']);
                    }
                    if (!empty($filter['manager_id'])) {
                        $q->where('reporting_manager_id', $filter['manager_id']);
                    }
                    if (!empty($filter['location_id'])) {
                        $q->where('location_id', $filter['location_id']);
                    }
                });
            })
            ->with([
                'details' => function ($q) {
                    $q->select(
                        'employee_code',
                        'user_id',
                        "department_id",
                        "designation_id",
                        "profile_image",
                        "gender",
                    );
                    $q->with([
                        'department' =>  function ($q) {
                            $q->select(
                                'id',
                                "code",
                                "name"
                            );
                        },
                        'designation' =>  function ($q) {
                            $q->select(
                                'id',
                                "title",
                                "description"
                            );
                        }
                    ]);
                }
            ])
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage']);
    }

    public function isEmailExists($email, $id = null): bool
    {
        return User::where('email', $email)->when(isset($id), function ($q) use ($id) {
            $q->where('id', '!=', $id);
        })->withoutGlobalScopes()->exists();
    }

    public function find($id)
    {
        $adminRoleId = Role::select('id')->withoutGlobalScopes()->where('is_admin', true)->first();
        return User::select(
            'id',
            'first_name',
            'last_name',
            'email',
            'is_active',
        )->where('role_id', '!=', $adminRoleId->id)->find($id);
    }

    public function findUserForEdit($id)
    {
        return User::select(
            'id',
            'first_name',
            'last_name',
            'calling_name',
            'role_id',
            'email',
            'is_active',
            'is_discharged',
        )->with([
            'details' => function ($q) {
                $q->select(
                    'id',
                    'user_id',
                    'id_number',
                    'employee_code_reference',
                    'employee_code',
                    'employee_code_id',
                    'department_id',
                    'designation_id',
                    'shift_id',
                    'profile_image',
                    'contact_no',
                    'address',
                    'country',
                    'reporting_manager_id',
                    'date_of_joined',
                    'leave_group_id',
                    'location_id',
                    'date_of_birth',
                    'contact_number_office',
                    'gender',
                );
            }
        ])->find($id);
    }

    public function exists($id): bool
    {
        return User::exists($id);
    }

    public function updateUserPassword($userId, $password)
    {
        $user = User::select('id')->where('id', $userId)->first();
        if (empty($user)) {
            abort(404, 'User details not found');
        }
        $user->update([
            'password' => Hash::make($password)
        ]);
        tenancy()->central(function () use ($userId, $password) {
            User::where('tenant_user_id', $userId)->update([
                'password' => Hash::make($password)
            ]);
        });
    }



    public function getRoleDropdown()
    {
        return User::select(
            'id',
            'name',
            'description',
            'is_active'
        )
            ->where('is_active', 1)
            ->where('is_admin', 0)
            ->orderBy('id', 'DESC')
            ->get();
    }

    public function getDropdown()
    {
        return User::select(
            'id',
            'first_name',
            'last_name'
        )->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
    public function getUserData($id)
    {
        return User::select('id', 'role_id')
            ->where('id', $id)->first();
    }

    public function getProfileDetails($userId)
    {

        return User::withoutGlobalScopes()->select(
            'id',
            'first_name',
            'last_name',
            'email',
            'calling_name',
            'role_id',
            'password',
            'is_active',
            'is_discharged'
        )
            ->with([
                'details' => function ($q) use ($userId) {
                    $q->withoutGlobalScopes()
                        ->where('user_id', $userId)
                        ->select(
                            'id',
                            'user_id',
                            'id_number',
                            'employee_code_reference',
                            'employee_code',
                            'employee_code_id',
                            'department_id',
                            'designation_id',
                            'shift_id',
                            'contact_no',
                            'address',
                            'country',
                            'department',
                            'designation',
                            'date_of_birth',
                            'profile_image',
                            'shift',
                            'date_of_joined',
                            'date_of_birth',
                            'contact_number_office',
                            'reporting_manager_id',
                            'gender'
                        );
                }
            ])
            ->orderBy('id', 'DESC')
            ->find($userId);
    }


    public function changePassword($userId, $oldPassword, $newPassword)
    {
        $user = auth()->user();

        if (!Hash::check($oldPassword, $user->password)) {
            return [
                'success' => false,
                'message' => 'Old password is incorrect',
            ];
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        tenancy()->central(function () use ($userId, $newPassword) {
            User::where('tenant_user_id', $userId)->update([
                'password' => Hash::make($newPassword)
            ]);
        });

        return [
            'success' => true,
            'message' => 'Password updated successfully',
        ];
    }

    public function getUserByLeaveGroup($leaveGroupID)
    {
        return User::select('id', DB::raw("CONCAT(first_name, ' ', last_name) as name"))
            ->where('is_active', 1)
            ->where('is_discharged', 0)
            ->whereHas('details', function ($q) use ($leaveGroupID) {
                $q->where('leave_group_id', $leaveGroupID);
            })->get();
    }

    public function getLeaveGroupDetails($userId)
    {
        return DB::table('user_details')
            ->leftJoin('leave_groups', 'user_details.leave_group_id', '=', 'leave_groups.id')
            ->where('user_details.user_id', $userId)
            ->select(
                'user_details.leave_group_id',
                'leave_groups.name as leave_type'
            )
            ->first();
    }

    public function getreportingManager($mangerID)
    {
        return DB::table('users')
                ->select(DB::raw("CONCAT(first_name, ' ', last_name) as name"))
                ->where('is_active', 1)
                ->where('id', $mangerID)
                ->first();
    }

    public function getAllForExcel($filter)
    {
        $adminRoleId = Role::select('id')->withoutGlobalScopes()->where('is_admin', true)->first();
        return User::select(
            'id',
            'first_name',
            'last_name',
            'email',
            'role_id',
            'is_active',
        )->where('role_id', '!=', $adminRoleId->id)
            ->when(isset($filter['search']) && !empty($filter['search']), function ($q) use ($filter) {
                $q->where(function ($q) use ($filter) {
                    $q->where('first_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('last_name', 'like', '%' . $filter['search'] . '%')
                        ->orWhere('email', 'like', '%' . $filter['search'] . '%');
                });
            })
             ->when(!empty($filter['department_id']) || !empty($filter['designation_id']) || !empty($filter['manager_id']) || !empty($filter['location_id']), function($q) use ($filter) {
                $q->whereHas('details', function($q) use ($filter) {
                    if (!empty($filter['department_id'])) {
                        $q->where('department_id', $filter['department_id']);
                    }
                    if (!empty($filter['designation_id'])) {
                        $q->where('designation_id', $filter['designation_id']);
                    }
                    if (!empty($filter['manager_id'])) {
                        $q->where('reporting_manager_id', $filter['manager_id']);
                    }
                    if (!empty($filter['location_id'])) {
                        $q->where('location_id', $filter['location_id']);
                    }
                });
            })
            ->with([
                'details' => function ($q) {
                    $q->select(
                        'employee_code',
                        'user_id',
                        'date_of_birth',
                        'contact_no',
                        'address',
                        'department',
                        'designation',
                        'country',
                        'date_of_joined',
                        "department_id",
                        "designation_id",
                        'reporting_manager_id', 
                        'location_id',
                        "profile_image",
                        "gender",
                    );
                    $q->with([
                        'department:id,name',
                        'designation:id,title',
                        'location:id,location_name',
                        'reportingManager:id,first_name,last_name'
                    ]);
                }
            ]);
    }

     public function getTodayCelebrationForUser($userId, $companyId)
    {
        $today = now()->format('m-d');

        return UserDetails::with('user')
            ->where('user_id', $userId)
            ->where('company_id', $companyId)
            ->where(function($q) use ($today) {
                $q->whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') = ?", [$today])
                  ->orWhereRaw("DATE_FORMAT(date_of_joined, '%m-%d') = ?", [$today]);
            })
            ->first();
    }

    public function getTodayCelebrationsForOthers($excludeUserId, $companyId)
    {
        $today = now()->format('m-d');

        return UserDetails::with('user')
            ->where('company_id', $companyId)
            ->where('user_id', '!=', $excludeUserId)
            ->where(function($q) use ($today) {
                $q->whereRaw("DATE_FORMAT(date_of_birth, '%m-%d') = ?", [$today])
                  ->orWhereRaw("DATE_FORMAT(date_of_joined, '%m-%d') = ?", [$today]);
            })
            ->get();
    }
}
