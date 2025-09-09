<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Attachment extends Model
{
    protected $table = 'attachments';

    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'file_name',
        'file_path',
        'mime_type',
        'file_extension',
        'file_size_in_mb',
        'company_id',
        'created_by',
        'updated_by',
        'deleted_by'
    ];
}
