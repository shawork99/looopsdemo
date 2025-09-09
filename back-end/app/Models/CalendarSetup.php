<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CalendarSetup extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;
    
    protected $table = 'calendar_setup';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'title',
        'date',
        'event_type',
        'company_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];
}
