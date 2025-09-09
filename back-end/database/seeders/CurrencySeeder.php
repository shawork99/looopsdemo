<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $insertDt[0] = [
            'code' => 'LKR',
            'name' => 'Srilankan Rupee',
            'created_at' => now()
        ];
        $insertDt[1] = [
            'code' => 'OMR',
            'name' => 'Oman Riyal',
            'created_at' => now()
        ];
        $insertDt[2] = [
            'code' => 'USD',
            'name' => 'United State Dollar',
            'created_at' => now()
        ];

        DB::table('currencies')->insert($insertDt);
    }
}
