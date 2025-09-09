<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShiftDetail extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'shift_id',
        'day_name',
        'start_time',
        'end_time',
        'grace_time',
        'work_hours',
        'work_hours_minute',
        'is_week_day',
        'company_id'
    ];
}
