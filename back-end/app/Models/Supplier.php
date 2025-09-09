<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{

    protected $fillable = [
        'supplier_code',
        'person_name',
        'email',
        'contact_number',
        'address',
        'company_name',
        'business_register_number',
        'status'
    ];
}
