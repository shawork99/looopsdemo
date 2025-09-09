<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeaveGroupDetail extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'leave_group_id',
        'leave_type_id',
        'policy',
        'no_of_days',
        'is_calendar_day',
        'maximum_applicable_days',
        'is_allow_minus',
        'is_carry_forward',
        'company_id'
    ];

    public function leaveType()
    {
        return $this->hasOne(LeaveType::class, 'id', 'leave_type_id');
    }

}
