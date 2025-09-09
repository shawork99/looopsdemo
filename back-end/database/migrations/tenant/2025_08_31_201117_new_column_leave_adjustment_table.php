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
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->tinyInteger('confirmed_yn')->nullable()->after('policy_type')->default(0);
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dateTime('confirmed_date')->after('confirmed_yn')->nullable();
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->unsignedBigInteger('confirmed_by')->after('confirmed_date')->nullable();
        });

        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->tinyInteger('approved_yn')->nullable()->after('confirmed_by')->default(0);
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dateTime('approved_date')->nullable()->after('approved_yn');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->unsignedBigInteger('approved_by')->nullable()->after('approved_date');
        });

        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->tinyInteger('rejected_yn')->nullable()->default(0)->after('approved_by');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dateTime('rejected_date')->nullable()->after('rejected_yn');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->unsignedBigInteger('rejected_by')->nullable()->after('rejected_date');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->tinyInteger('noOfLevel')->nullable()->default(1)->after('rejected_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('confirmed_yn');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('confirmed_date');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('confirmed_by');
        });


        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('approved_yn');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('approved_date');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('approved_by');
        });


        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('rejected_yn');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('rejected_date');
        });
        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('rejected_by');
        });

        Schema::table('leave_ajustments', function (Blueprint $table) {
            $table->dropColumn('noOfLevel');
        });
    }
};
