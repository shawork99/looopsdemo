<?php
namespace App\Repositories;

use App\Models\ApprovalLevel;
use Illuminate\Support\Facades\DB;

class ApprovalLevelRepository
{
    public function getAll($filter)
    {
        return ApprovalLevel::select(
            'id',
            'level',
            'approver_id',
            'approver_role_id',
            'document_system_id',
            'is_mandatory',
            'status'
        )->with([
            'approver' => function ($q) {
                $q->select('id', 'first_name', 'last_name');
            }, 'role' => function ($q) {
                $q->select('id', 'name', 'description');
            }, 'document' => function ($q) {
                $q->select('id', 'document_code', 'description');
            }
        ])->orderBy('id', 'DESC')->paginate($filter['perPage']);
    }

    public function find($id)
    {
        return ApprovalLevel::select(
            'id',
            'level',
            'approver_id',
            'approver_role_id',
            'document_system_id',
            'is_mandatory',
            'status'
        )->find($id);
    }

    public function create(array $data)
    {
        try{
            return DB::transaction(function () use ($data) {
                ApprovalLevel::create($data);
                return [
                    'success' => true,
                    'message' => 'Successfully created'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function update($id, array $data)
    {
        try{
            return DB::transaction(function () use ($id, $data) {
                $level = ApprovalLevel::findOrFail($id);
                $level->update($data);
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function delete($id)
    {
        try{
            return DB::transaction(function () use ($id) {
                ApprovalLevel::where('id', $id)->delete();
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    
    }

    public function checkLevelAlreadyExists($input, $id = null): bool {
        $level = $input['level'];
        $documentSystemID = $input['document_system_id'];

        return ApprovalLevel::where('level', $level)
            ->where('document_system_id', $documentSystemID)
            ->when(isset($id), function ($q) use ($id) {
                $q->where('id', '!=', $id);
            })->exists();
    }
    public function isLevelChangeValid(int $documentSystemId, int $newLevel, ?int $currentId = null): bool
    {
        $existingLevels = ApprovalLevel::where('document_system_id', $documentSystemId)
            ->when($currentId, fn($q) => $q->where('id', '!=', $currentId))
            ->whereNull('deleted_at')
            ->pluck('level')
            ->sort()
            ->values();

        if ($existingLevels->isEmpty()) {
            return $newLevel === 1;
        }

        $maxExisting = $existingLevels->max();
        if ($newLevel === $maxExisting + 1) {
            return true;
        }

        return false;
    }


    public function hasNextLevel($documentSystemId, $level)
    {
        return ApprovalLevel::where('document_system_id', $documentSystemId)
                            ->where('level', '>', $level)
                            ->exists();
    }

}
