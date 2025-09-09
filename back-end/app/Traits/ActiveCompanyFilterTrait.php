<?php

namespace App\Traits;

use App\Models\Scopes\ActiveCompanyScope;

trait ActiveCompanyFilterTrait
{
    public static function bootActiveCompanyFilterTrait()
    {
        static::addGlobalScope(new ActiveCompanyScope);
    }
}

