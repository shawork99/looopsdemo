<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveAdjustment extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $table = 'leave_ajustments';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'document_code',
        'serial_no',
        'adjustment_date',
        'description',
        'leave_group_id',
        'policy_type',
        'confirmed_yn',
        'confirmed_date',
        'confirmed_by',
        'company_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function leave_group()
    {
        return $this->belongsTo(LeaveGroup::class, 'leave_group_id', 'id');
    }
    public function leave_adjustment_employees()
    {
        return $this->hasMany(LeaveAdjustmentEmployee::class, 'leave_adjustment_id', 'id');
    }
}
