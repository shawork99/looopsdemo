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
        Schema::create('user_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->integer('employee_code_id')->nullable();
            $table->string('employee_code')->nullable();
            $table->string('employee_code_reference')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('id_number')->nullable();
            $table->string('contact_no')->nullable();
            $table->mediumText('address')->nullable();
            $table->string('country')->nullable();
            $table->json('department')->nullable();
            $table->json('designation')->nullable();
            $table->json('shift')->nullable();
            $table->dateTime('date_of_joined')->nullable();
            $table->unsignedBigInteger('department_id')->nullable();
            $table->unsignedBigInteger('designation_id')->nullable();
            $table->unsignedBigInteger('shift_id')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->unsignedBigInteger('deleted_by')->nullable();
            $table->unsignedBigInteger('company_id');
            $table->unsignedBigInteger('reporting_manager_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('department_id')->references('id')->on('departments');
            $table->foreign('designation_id')->references('id')->on('designations');
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');
            $table->foreign('deleted_by')->references('id')->on('users');
            $table->foreign('company_id')->references('id')->on('company');
            $table->foreign('reporting_manager_id')->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_details');
    }
};
