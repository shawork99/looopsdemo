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
        Schema::create('leave_groups', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->foreign('company_id')->references('id')->on('company');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('deleted_by')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
        Schema::create('leave_group_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('leave_group_id');
            $table->unsignedBigInteger('leave_type_id');
            $table->string('policy');
            $table->float('no_of_days');
            $table->boolean('is_calendar_day')->default(0);
            $table->float('maximum_applicable_days')->default(0);
            $table->boolean('is_allow_minus')->default(0);
            $table->float('is_carry_forward')->default(0);
            $table->unsignedBigInteger('company_id');
            $table->foreign('leave_group_id')->references('id')->on('leave_groups');
            $table->foreign('leave_type_id')->references('id')->on('leave_types');
            $table->foreign('company_id')->references('id')->on('company');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_group_details');
        Schema::dropIfExists('leave_groups');
    }
};
