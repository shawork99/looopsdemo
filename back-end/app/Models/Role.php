<?php

namespace App\Models;

use App\Models\Scopes\FilterByAdminRoleScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;

class Role extends Model
{
    protected $table = 'roles';

    use SoftDeletes, ActiveCompanyFilterTrait, AuditRecordsTrait;

    protected $fillable = [
        'name',
        'description',
        'company_id',
        'is_admin',
        'is_active',
        'navigations',
        'permissions',
        'created_by',
        'updated_by',
        'deleted_by'
    ];

    protected $cast = [
        'navigations' => 'json',
        'permissions' => 'json',
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new FilterByAdminRoleScope);
    }

    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'id'); 
    }
}
