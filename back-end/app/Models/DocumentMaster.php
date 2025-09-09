<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentMaster extends Model
{
    use SoftDeletes;

    protected $table = 'document_master';

    protected $fillable = [
        'document_code',
        'description',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function approvalLevels()
    {
        return $this->hasMany(ApprovalLevel::class, 'document_system_id');
    }
}
