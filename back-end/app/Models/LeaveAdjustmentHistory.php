<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveAdjustmentHistory extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $table = 'leave_ajustment_history';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'change_amount',
        'balance_before',
        'balance_after',
        'company_id',
        'adjusted_by',
        'adjusted_at',
        'source_id',
        'source_name'
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ActiveCompanyScope);
    }
}
