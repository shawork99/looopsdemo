<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Role;
use App\Models\Shift;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Stancl\Tenancy\Events\InitializingTenancy;

class SampleDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $tenantCode = 'test_company';
        $tenant = Tenant::create([
            'id' => $tenantCode,  // can be uuid, subdomain, etc
        ]);
        User::create([
            'first_name' => 'James',
            'last_name' => 'Bond',
            'calling_name' => 'admin',
            'email' => 'admin@mail.com',
            'is_active' => true,
            'is_discharged' => true,
            'password' => Hash::make('12345'),
            'base_company_id' => 1,
            'current_company_id' => 1,
            'tenant_id' => $tenantCode,
            'role_id' => 1,
            'tenant_user_id' => 1
        ]);


        // (optional) Run migrations for this tenant
        $tenant->domains()->create(
            [
                'domain'  => 'localhost'
            ]
        );
        tenancy()->initialize($tenantCode);
        Company::insert([
            [
                'id' => '1',
                'name' => 'Test Company',
                'is_active' => true,
            ],
            [
                'id' => '2',
                'name' => 'Load Company',
                'is_active' => true,
            ],

        ]);

        Role::create([
            'name' => 'Admin',
            'description' => 'Admin Role',
            'company_id' => 1,
            'is_admin' => true,
            'is_active' => true
        ]);
        Role::create([
            'name' => 'Manager',
            'description' => 'Manager Role',
            'company_id' => 1,
            'is_admin' => false,
            'is_active' => true
        ]);

        $user = User::create([
            'first_name' => 'James',
            'last_name' => 'Bond',
            'role_id' => 1,
            'email' => 'admin@mail.com',
            'password' => Hash::make('12345'),
            'base_company_id' => 1,
            'current_company_id' => 1,
            'tenant_id' => $tenantCode
        ]);
        DB::table('users_company')->insert([
            'user_id' => $user['id'],
            'company_id' => 1
        ]);

        Department::create([
            'code' => 'GEN',
            'name' => 'General',
            'company_id' => 1,
            'is_active' => true,
            'created_by' => 1,
            'updated_by' => 1,
            'deleted_by' => 1
        ]);

        Designation::create([
            'title' => 'Admin',
            'description' => 'System Admin',
            'company_id' => 1,
            'is_active' => true,
            'created_by' => 1,
            'updated_by' => 1,
            'deleted_by' => 1
        ]);

        Shift::create([
            'code' => 'Default Shift',
            'name' => 'Default Shift',
            'is_active' => true,
            'company_id' => 1,
            'created_by' => 1,
            'updated_by' => 1,
            'deleted_by' => 1
        ]);

        $this->call(NavigationSeeder::class);
    }
}
