<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveAdjustmentEmployee extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $table = 'leave_ajustment_employees';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'leave_adjustment_id',
        'employee_id',
        'leave_type_id',
        'previous_balance',
        'adjusted_balance',
        'new_balance',
        'remarks',
        'company_id',
        'created_by',
        'updated_by',
        'deleted_at'
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ActiveCompanyScope);
    }

    public function employee()
    {
        return $this->belongsTo(User::class, 'employee_id');
    }

    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class, 'leave_type_id');
    }
    public static function getLeaveAdjustmentEmployeeDetails($leaveAdjustmentID)
    {
        return self::select('id', 'leave_adjustment_id', 'employee_id', 'leave_type_id')->where('leave_adjustment_id', $leaveAdjustmentID)->get();
    }
}
