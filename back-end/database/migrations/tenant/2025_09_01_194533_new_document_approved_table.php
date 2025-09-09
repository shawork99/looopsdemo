<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $exists = DB::table('document_master')->where('document_code', 'LA')->exists();
        if (!$exists) {
            DB::table('document_master')->insert([
                'document_code' => 'LA',
                'description' => 'Leave Adjustment',
                'is_active' => true,
                'created_at' => now()
            ]);
        }
        if (!Schema::hasTable('document_approved')) {
            Schema::create('document_approved', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('company_id');
                $table->unsignedBigInteger('doument_id');
                $table->unsignedBigInteger('document_system_id');
                $table->string('document_system_code', 50);
                $table->unsignedBigInteger('approver_id');
                $table->tinyInteger('level');
                $table->dateTime('action_date')->nullable();
                $table->enum('status', ['open', 'pending approval', 'approved', 'rejected'])->nullable();
                $table->string('comment', 200)->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
        if (!Schema::hasColumn('leave_ajustments', 'document_code')) {
            Schema::table('leave_ajustments', function (Blueprint $table) {
                $table->string('document_code', 50)->after('id');
            });
        }
        if (!Schema::hasColumn('leave_ajustments', 'serial_no')) {
            Schema::table('leave_ajustments', function (Blueprint $table) {
                $table->integer('serial_no')->after('document_code')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_approved');
        if (Schema::hasColumn('leave_ajustments', 'document_code')) {
            Schema::table('leave_ajustments', function (Blueprint $table) {
                $table->dropColumn('document_code');
            });
        }
        if (Schema::hasColumn('leave_ajustments', 'serial_no')) {
            Schema::table('leave_ajustments', function (Blueprint $table) {
                $table->dropColumn('serial_no');
            });
        }
    }
};
