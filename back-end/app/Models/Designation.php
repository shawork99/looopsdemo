<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Designation extends Model
{
    protected $table = 'designations';

     use SoftDeletes, ActiveCompanyFilterTrait,AuditRecordsTrait;


    protected $fillable = [
        'title',
        'description',
        'company_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function users()
    {
        return $this->hasMany(UserDetails::class, 'designation_id', 'id');
    }
}
