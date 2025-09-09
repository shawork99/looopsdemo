<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ApprovalLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        if (!Schema::hasTable('document_master')) {
            Schema::create('document_master', function (Blueprint $table) {
                $table->id();
                $table->string('document_code', 20);
                $table->string('description', 150);
                $table->boolean('is_active')->default(true)->nullable();
                $table->unsignedBigInteger('company_id')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->foreign('created_by')->references('id')->on('users');
                $table->foreign('updated_by')->references('id')->on('users');
                $table->foreign('deleted_by')->references('id')->on('users');
                $table->timestamps();
                $table->softDeletes();
            });
        }

        $exists = DB::table('document_master')->where('document_code', 'LEV')->exists();
        if (!$exists) {
            DB::table('document_master')->insert([
                'document_code' => 'LEV',
                'description' => 'Leave',
                'is_active' => true,
                'created_at' => now()
            ]);
        }

        if (!Schema::hasTable('approval_levels')) {
            Schema::create('approval_levels', function (Blueprint $table) {
                $table->id();
                $table->integer('level');
                $table->unsignedBigInteger('approver_id');
                $table->unsignedBigInteger('approver_role_id')->nullable();
                $table->unsignedBigInteger('document_system_id')->nullable();
                $table->boolean('is_mandatory')->default(true);
                $table->enum('status', ['active', 'inactive'])->default('active');
                $table->unsignedBigInteger('created_by')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->foreign('approver_id')->references('id')->on('users');
                $table->foreign('approver_role_id')->references('id')->on('roles');
                $table->foreign('document_system_id')->references('id')->on('document_master');
                $table->foreign('created_by')->references('id')->on('users');
                $table->foreign('updated_by')->references('id')->on('users');
                $table->foreign('deleted_by')->references('id')->on('users');
                $table->timestamps();
                $table->softDeletes();
            });
        }
        if (!Schema::hasColumn('approval_levels', 'company_id')) {
            Schema::table('approval_levels', function (Blueprint $table) {
                $table->unsignedBigInteger('company_id')->nullable()->after('status');
            });
        }
    }
}
