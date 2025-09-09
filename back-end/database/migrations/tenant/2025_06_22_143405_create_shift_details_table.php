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
        Schema::table('shifts', function (Blueprint $table) {
            $table->json('weekdays')->nullable();
            $table->json('weekend')->nullable();
        });

        Schema::create('shift_details', function (Blueprint $table) {
            $table->id();
            $table->text('day_name');
            $table->text('start_time')->nullable();
            $table->text('end_time')->nullable();
            $table->float('grace_time')->nullable();
            $table->text('work_hours')->nullable();
            $table->float('work_hours_minute')->nullable();
            $table->boolean('is_week_day');
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('shift_id');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('company_id')->references('id')->on('company');
            $table->foreign('shift_id')->references('id')->on('shifts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropColumn('weekdays');
            $table->dropColumn('weekend');
        });
        Schema::dropIfExists('shift_details');
    }
};
