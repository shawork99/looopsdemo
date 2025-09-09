<?php

namespace App\Models;

use App\Traits\ActiveCompanyFilterTrait;
use App\Traits\AuditRecordsTrait;
use App\Traits\FileUploadTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
//
class UserDetails extends Model
{
    use SoftDeletes, AuditRecordsTrait, ActiveCompanyFilterTrait;
    use FileUploadTrait;

    protected $fillable = [
        'user_id',
        'id_number',
        'employee_code_reference',
        'employee_code',
        'employee_code_id',
        'department_id',
        'designation_id',
        'shift_id',
        'profile_image',
        'contact_no',
        'address',
        'country',
        'reporting_manager_id',
        'department',
        'designation',
        'shift',
        'date_of_joined',
        'contact_number_office',
        'leave_group_id',
        'location_id',
        'date_of_birth', 
        'company_id',
        'created_by',
        'updated_by',
        'deleted_by',
        'gender'
    ];

    protected $casts = [
        'department' => 'json',
        'designation' => 'json',
        'shift' => 'json',
    ];

    public function getProfileImageAttribute()
    {
        $profileImage = $this->attributes['profile_image'] ?? null;

        if (!empty($profileImage)) {
            return $this->generateS3TemporaryUrl($profileImage, 2880);
        }

        return null; // or return a default URL if you want
    }

    public function department()
    {
        return $this->hasOne(Department::class, 'id', 'department_id');
    }

    public function designation()
    {
        return $this->hasOne(Designation::class, 'id', 'designation_id');
    }

    public function location()
    {
        return $this->hasOne(Location::class, 'id', 'location_id');
    }

    public function reportingManager()
    {
        return $this->hasOne(User::class, 'id', 'reporting_manager_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
