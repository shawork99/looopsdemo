<?php
namespace App\Repositories;

use App\Models\Company;
use App\Models\User;
use App\Traits\FileUploadTrait; 

class CompanyRepository
{
    use FileUploadTrait;
    
    public function find($companyId)
    {
        return Company::find($companyId);
    }

    public function findForUser($userId)
    {
        $user = User::withoutGlobalScopes()->find($userId);
        return Company::select(
            'id',
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
        )->find($user->current_company_id);
    }

    public function update($companyId, $data)
    {
        $company = $this->find($companyId);
        $updateData = $data;

         $currentLogoPath = $company->getRawOriginal('company_logo');

        if (!empty($data['company_logo']) && str_starts_with($data['company_logo'], 'data:image/')) {
            $uploadResult = $this->uploadBase64FileUsingSystemUser($data['company_logo']);
            $updateData['company_logo'] = $uploadResult['path']; // only path stored in DB

            // delete old file if exists
            $currentLogoPath = $company->getRawOriginal('company_logo');
            if (!empty($currentLogoPath)) {
                $this->deleteFile($currentLogoPath);
            }
        } else {
            unset($updateData['company_logo']);
        }


        if ($company) {
            $company->update($updateData);
        }
        return $company;
    }
}
