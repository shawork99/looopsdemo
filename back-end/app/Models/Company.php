<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Traits\FileUploadTrait;

class Company extends Model
{
    use FileUploadTrait;
    protected $table = 'company';

   protected $fillable = [
        'name',
        'company_code',
        'country',
        'currency',
        'time_zone',
        'contact_person',
        'contact_email',
        'contact_no',
        'company_start_date',
        'memo',
        'is_active',
        'company_logo'
    ];

    public function getCompanyLogoAttribute()
    {
        $company_logo = $this->attributes['company_logo'] ?? null;

        if (!empty($company_logo)) {
            return $this->generateS3TemporaryUrl($company_logo, 2880);
        }

        return null; 
    }

}
