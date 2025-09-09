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
        Schema::create('company', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
            $table->softDeletes();
            $table->string('company_code', 50);
            $table->string('country', 20);
            $table->unsignedBigInteger('currency');
            $table->string('time_zone', 50)->nullable();
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->integer('contact_no')->nullable();
            $table->date('company_start_date')->nullable();
            $table->longText('memo')->nullable();

            $table->foreign('currency')->references('id')->on('currencies');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company');
    }
};
