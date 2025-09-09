<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestStatus extends Model
{
    protected $table = 'request_status';

    use SoftDeletes, ActiveCompanyFilterTrait,AuditRecordsTrait;


    protected $fillable = [
        'code',
        'name',
        'sort_order',
        'background_color',
        'based_type',
        'request_type_id',
        'company_id',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
