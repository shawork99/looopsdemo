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
        Schema::create('attendance_log', function (Blueprint $table) {
            $table->id();
            $table->foreign('company_id')->references('id')->on('company');
            $table->foreign('shift_id')->references('id')->on('shifts');
            $table->foreign('user_id')->references('id')->on('users');
            $table->date('date')->comment('Attendance date (YYYY-MM-DD)');
            $table->json('status')->nullable()->comment('JSON array of status entries');
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['user_id', 'shift_id', 'date'], 'attendance_unique_user_shift_date');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('shift_id');
            $table->unsignedBigInteger('user_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_log');
    }
};
