<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('request_types')->insert(array(
            0 =>
                array(
                    'id' => 1,
                    'code' => 'req1',
                    'name' => 'Request Type 1',
                    'is_active' => 1
                ),
            1 =>
                array(
                    'id' => 2,
                    'code' => 'req2',
                    'name' => 'Request Type 2',
                    'is_active' => 1
                )
        ));

    }
}
