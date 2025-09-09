<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;



class Attandance_log extends Model
{
   protected $table = 'attendance_log';

   protected $fillable = [
        'user_id',
        'shift_id',
        'company_id',
        'date',
        'status'
    ];
}
