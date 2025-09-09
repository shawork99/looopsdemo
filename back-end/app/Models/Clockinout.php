<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\SoftDeletes;



class Clockinout extends Model
{
   protected $table = 'clockin_out';

   protected $fillable = [
        'action_type',
        'action_time',
        'latitude',
        'longitude',
        'location_name',
        'comments',
        'device_type',
        'company_id',
        'shift_id',
        'user_id'
    ];


    public function shiftdetails()
    {
        return $this->hasOne(ShiftDetail::class, 'shift_id', 'shift_id');
    }


}
