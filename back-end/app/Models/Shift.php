<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Shift extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'code',
        'name',
        'company_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
        'weekdays',
        'weekend'
    ];

    protected $cast = [
        'weekdays' => 'json',
        'weekend' => 'json',
    ];

    public function shiftDetails()
    {
        return $this->hasMany(ShiftDetail::class, 'shift_id');
    }
}
