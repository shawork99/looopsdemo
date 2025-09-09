<?php

namespace App\Repositories;

use App\Models\Company;
use App\Models\LeaveAdjustment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LeaveAdjustmentRepository
{

    public function getAll($filter)
    {
        return LeaveAdjustment::select(
            'id',
            'document_code',
            'adjustment_date',
            'description',
            'leave_group_id',
            'policy_type',
            'confirmed_yn',
            'approved_yn',
            'rejected_yn'
        )->with([
            'leave_group' => function ($q) {
                $q->select('id', 'code', 'name');
            }
        ])
            ->orderBy('id', 'DESC')->paginate($filter['perPage']);
    }

    public function find($id)
    {
        return LeaveAdjustment::select(
            'id',
            'adjustment_date',
            'document_code',
            'description',
            'leave_group_id',
            'policy_type',
            'confirmed_yn'
        )->findOrFail($id);
    }

    public function create(array $data)
    {
        try {
            // Get the last serial number
            $lastSerial = LeaveAdjustment::max('serial_no');
            $latestSerialNo = $lastSerial ? $lastSerial + 1 : 1;

            $companyCode = Company::where('id', Auth::user()->current_company_id)->value('company_code');
            $companyCode = $companyCode ?: '';

            $data['serial_no'] = $latestSerialNo;
            $data['document_code'] = $companyCode
                ? sprintf("%s/LA/%05d", $companyCode, $latestSerialNo)
                : sprintf("LA/%05d", $latestSerialNo);

            return DB::transaction(function () use ($data) {
                LeaveAdjustment::create($data);
                return [
                    'success' => true,
                    'message' => 'Successfully created'
                ];
            });
        } catch (\Exception $ex) {
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function update($id, array $data)
    {
        try {
            return DB::transaction(function () use ($id, $data) {
                $level = LeaveAdjustment::findOrFail($id);
                $level->update($data);
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex) {
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function delete($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                LeaveAdjustment::where('id', $id)->delete();
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex) {
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }
    public function checkLeaveAdjNotApproved($leave_group_id, $id = 0)
    {
        $leaveAdjustment = LeaveAdjustment::when($id > 0, function ($q) use ($id) {
            $q->where('id', '!=', $id);
        })->where('leave_group_id', $leave_group_id)
            ->where(function ($q) {
                $q->where('approved_yn', 0);
            })->exists();
        if ($leaveAdjustment) {
            return ['success' => false, 'message' => 'There is a Leave Adjustment not approved for selected leave group'];
        }
        return ['success' => true, 'message' => 'Can create'];
    }
}
