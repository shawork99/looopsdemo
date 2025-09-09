<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveType extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'code',
        'name',
        'company_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
