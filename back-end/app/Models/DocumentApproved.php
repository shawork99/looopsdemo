<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentApproved extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $table = 'document_approved';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'company_id',
        'doument_id',
        'document_system_id',
        'document_system_code',
        'approver_id',
        'level',
        'action_date',
        'status',
        'comment'
    ];
}
