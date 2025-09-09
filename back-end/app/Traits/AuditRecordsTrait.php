<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait AuditRecordsTrait
{
    public static function bootAuditRecordsTrait()
    {
        static::creating(function ($model) {
            $userId = auth()->id();
            if ($model->isFillable('created_by') && $userId) {
                $model->created_by = $userId;
            }
            if ($model->isFillable('updated_by') && $userId) {
                $model->updated_by = $userId;
            }
            if ($model->isFillable('company_id') && $userId) {
                $model->company_id = Auth::user()->current_company_id;
            }
        });

        static::updating(function ($model) {
            if ($model->isFillable('updated_by')) {
                $model->updated_by = auth()->id();
            }
        });

        static::deleting(function ($model) {
            if ($model->isFillable('deleted_by')) {
                $model->deleted_by = auth()->id();
                $model->save(); // Save before soft delete
            }
        });
    }
}

