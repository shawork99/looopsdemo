<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::table('company', function (Blueprint $table) {
        $table->string('company_code', 50)->after('deleted_at')->nullable();
        $table->string('country', 20)->after('company_code')->nullable();
        $table->unsignedBigInteger('currency')->after('country')->nullable();
        $table->string('time_zone', 50)->after('currency')->nullable();
        $table->string('contact_person', 255)->after('time_zone')->nullable();
        $table->string('contact_email', 255)->after('contact_person')->nullable();
        $table->string('contact_no')->after('contact_email')->nullable();
        $table->date('company_start_date')->after('contact_no')->nullable();
        $table->longText('memo')->after('company_start_date')->nullable();

        $table->foreign('currency')->references('id')->on('currencies');
    });
}




    public function down(): void
    {
        Schema::table('company', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['currency']);
            
            // Drop the columns added
            $table->dropColumn([
                'company_code',
                'country',
                'currency',
                'time_zone',
                'contact_person',
                'contact_email',
                'contact_no',
                'company_start_date',
                'memo'
            ]);
        });
    }
};
