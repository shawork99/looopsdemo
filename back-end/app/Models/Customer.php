<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
class Customer extends Model
{
   

    protected $fillable = [
        'customer_code',
        'person_name',
        'company_name',
        'email',
        'contact_number',
        'address',
        'currency_id',
        'business_registration_no',
        'status',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
