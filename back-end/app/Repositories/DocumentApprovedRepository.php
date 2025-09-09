<?php

namespace App\Repositories;

use App\Models\LeaveAdjustment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DocumentApprovedRepository
{

    public function getAll($filter)
    {
        $userId = Auth::user()->id;

        return DB::table('document_approved as da')
            ->join('document_master as dm', 'dm.id', '=', 'da.doument_id')
            ->leftJoin('leave_ajustments as ladj', function ($join) {
                $join->on('ladj.id', '=', 'da.document_system_id')
                    ->where('da.doument_id', 2);
            })
            ->join('users as emp', 'emp.id', '=', 'da.approver_id')
            ->where('da.approver_id', $userId)
            ->where(function ($q) {
                $q->where(function ($sub) {
                    $sub->whereNotNull('ladj.id')
                        ->whereRaw('ladj.noOfLevel = da.level')
                        ->where('ladj.confirmed_yn', 1)
                        ->where('ladj.approved_yn', 0)
                        ->where('ladj.rejected_yn', 0);
                });
            })
            ->select(
                'da.*',
                'dm.description as document_name',
                DB::raw("CONCAT(emp.first_name, ' ', emp.last_name) as employee_name")
            )
            ->paginate($filter['perPage']);
    }
    public function getMasterTable($documentId)
    {
        switch ($documentId) {
            case 2:
                $model = LeaveAdjustment::class;
                break;
            default:
                return ['success' => false, 'message' => 'Document ID not found', 'data' => null];
        }

        return ['success' => true, 'message' => 'Model set successfully', 'data' => $model];
    }
}
