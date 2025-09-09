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
        Schema::create('clockin_out', function (Blueprint $table) {
            $table->id();
            $table->enum('action_type', ['clock_in', 'clock_out']);
            $table->dateTime('action_time');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('location_name', 255)->nullable();
            $table->text('comments')->nullable();
            $table->string('device_type', 50)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('shift_id');
            $table->unsignedBigInteger('user_id');

            $table->foreign('company_id')->references('id')->on('company');
            $table->foreign('shift_id')->references('id')->on('shifts');
            $table->foreign('user_id')->references('id')->on('users');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clockin_out');
    }
};
