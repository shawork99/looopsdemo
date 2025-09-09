<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('leave_ajustments')) {
            Schema::create('leave_ajustments', function (Blueprint $table) {
                $table->id();
                $table->date('adjustment_date');
                $table->string('description', 150);
                $table->unsignedBigInteger('leave_group_id');
                $table->enum('policy_type', ['yearly', 'monthly'])->default('yearly');
                $table->unsignedBigInteger('company_id')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->foreign('created_by')->references('id')->on('users');
                $table->foreign('updated_by')->references('id')->on('users');
                $table->foreign('deleted_by')->references('id')->on('users');
                $table->foreign('leave_group_id')->references('id')->on('leave_groups');
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('leave_ajustment_employees')) {
            Schema::create('leave_ajustment_employees', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('leave_adjustment_id');
                $table->unsignedBigInteger('employee_id');
                $table->unsignedBigInteger('leave_type_id');
                $table->decimal('previous_balance', 5, 2)->nullable();
                $table->decimal('adjusted_balance', 5, 2)->nullable();
                $table->decimal('new_balance', 5, 2)->nullable();
                $table->string('remarks', 200)->nullable();
                $table->unsignedBigInteger('company_id')->nullable();
                $table->unsignedBigInteger('created_by')->nullable();
                $table->unsignedBigInteger('updated_by')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->foreign('leave_adjustment_id')->references('id')->on('leave_ajustments');
                $table->foreign('employee_id')->references('id')->on('users');
                $table->foreign('leave_type_id')->references('id')->on('leave_types');
                $table->foreign('created_by')->references('id')->on('users');
                $table->foreign('updated_by')->references('id')->on('users');
                $table->foreign('deleted_by')->references('id')->on('users');
                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('leave_ajustment_history')) {
            Schema::create('leave_ajustment_history', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('employee_id');
                $table->unsignedBigInteger('leave_type_id');
                $table->decimal('change_amount', 5, 2);
                $table->decimal('balance_before', 5, 2);
                $table->decimal('balance_after', 5, 2);
                $table->string('reason', 200);
                $table->tinyInteger('source_id')->nullable();
                $table->string('source_name', 30)->nullable();
                $table->unsignedBigInteger('company_id')->nullable();
                $table->unsignedBigInteger('adjusted_by')->nullable();
                $table->dateTime('adjusted_at')->nullable();
                $table->unsignedBigInteger('deleted_by')->nullable();
                $table->foreign('employee_id')->references('id')->on('users');
                $table->foreign('leave_type_id')->references('id')->on('leave_types');
                $table->foreign('adjusted_by')->references('id')->on('users');
                $table->foreign('deleted_by')->references('id')->on('users');
                $table->timestamps();
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_setup');
        Schema::dropIfExists('leave_ajustment_employees');
        Schema::dropIfExists('leave_ajustment_history');
    }
};
