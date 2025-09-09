<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    protected $table = 'departments';

     use SoftDeletes, ActiveCompanyFilterTrait,AuditRecordsTrait;

    protected $fillable = [
        'code',
        'name',
        'company_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    public function users()
    {
        return $this->hasMany(UserDetails::class, 'department_id', 'id');
    }
}
