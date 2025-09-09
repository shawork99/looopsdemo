<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Scopes\FilterByBaseConpanyScope;
use App\Traits\AuditRecordsTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Auth;


class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, AuditRecordsTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'calling_name',
        'role_id',
        'email',
        'is_active',
        'is_discharged',
        'password',
        'base_company_id',
        'current_company_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'tenant_id',
        /**** Main database uniue fields **/
        'tenant_user_id',
        /**** Main database uniue fields **/
    ];


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope(new FilterByBaseConpanyScope);
    }


    public function role()
    {
        return $this->hasOne(Role::class, 'id', 'role_id');
    }


    public function currentCompany()
    {
        return $this->hasOne(Company::class, 'id', 'current_company_id');
    }

    public function details()
    {
        return $this->hasOne(UserDetails::class, 'user_id', 'id');
    }
}
