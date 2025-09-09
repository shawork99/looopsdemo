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
        Schema::table('user_details', function (Blueprint $table) {
            $table->unsignedBigInteger('leave_group_id')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->foreign('leave_group_id')->references('id')->on('leave_groups');
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_details', function (Blueprint $table) {
            $table->dropForeign(['leave_group_id']);
            $table->dropForeign(['location_id']);
            $table->dropColumn('leave_group_id');
            $table->dropColumn('location_id');
        });
    }
};
