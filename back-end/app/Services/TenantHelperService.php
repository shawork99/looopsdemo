<?php

namespace App\Services;

class TenantHelperService
{
    public function __construct()
    {
        //
    }

     public function getActiveTenant()
    {
        return tenant('id');
    }

}
