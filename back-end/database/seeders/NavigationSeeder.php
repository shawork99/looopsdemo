<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Scopes\FilterByAdminRoleScope;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class NavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $navigation = config('navigation'); 
        Role::withoutGlobalScopes([new FilterByAdminRoleScope])->where('is_admin', true)->update([
            'navigations' => $navigation['navigation'],
            'permissions' => $navigation['permissions']
        ]);
    }
}
