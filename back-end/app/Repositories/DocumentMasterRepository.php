<?php 
namespace App\Repositories;

use App\Models\DocumentMaster;

class DocumentMasterRepository
{
    public function all()
    {
        return DocumentMaster::with('approvalLevels')->get();
    }

    public function find($id)
    {
        return DocumentMaster::with('approvalLevels')->findOrFail($id);
    }

    public function create(array $data)
    {
        return DocumentMaster::create($data);
    }

    public function update($id, array $data)
    {
        $doc = DocumentMaster::findOrFail($id);
        $doc->update($data);
        return $doc;
    }

    public function delete($id)
    {
        $doc = DocumentMaster::findOrFail($id);
        return $doc->delete();
    }
    public function getDocumentMasterDropdown()
    {
        return DocumentMaster::select(
            'id',
            'document_code',
            'description'
        )
            ->where('is_active', 1)
            ->orderBy('id', 'DESC')
            ->get();
    }
    public function isActiveAndExists($id): bool
    {
        return DocumentMaster::where('is_active', 1)->where('id', $id)->exists();
    }
}
