<?php

namespace App\Models;

use App\Models\Scopes\ActiveCompanyScope;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApprovalLevel extends Model
{
    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $table = 'approval_levels';

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'level',
        'approver_id',
        'approver_role_id',
        'document_system_id',
        'is_mandatory',
        'status',
        'company_id',
        'created_by',
        'updated_by',
        'deleted_by',
    ];

    public function document()
    {
        return $this->belongsTo(DocumentMaster::class, 'document_system_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'approver_role_id');
    }

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new ActiveCompanyScope);
    }
    public static function getApprovalLevel($document_id)
    {
        return ApprovalLevel::select('id', 'level', 'approver_id', 'status')
            ->where('document_system_id', $document_id)
            ->where('status', 'active')
            ->get();
    }
}
