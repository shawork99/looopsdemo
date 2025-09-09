<?php

namespace App\Http\Controllers;

use App\Repositories\DocumentMasterRepository;
use Illuminate\Http\Request;

class DocumentMasterController extends Controller
{
    protected $repo;

    public function __construct(DocumentMasterRepository $repo)
    {
        $this->repo = $repo;
    }

    public function index()
    {
        return response()->json($this->repo->all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'document_code' => 'required|string|max:20',
            'description' => 'required|string|max:150',
            'is_active' => 'boolean',
            'created_by' => 'nullable|exists:users,id',
        ]);
        return response()->json($this->repo->create($data));
    }

    public function show($id)
    {
        return response()->json($this->repo->find($id));
    }

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'document_code' => 'sometimes|string|max:20',
            'description' => 'sometimes|string|max:150',
            'is_active' => 'boolean',
            'updated_by' => 'nullable|exists:users,id',
        ]);
        return response()->json($this->repo->update($id, $data));
    }

    public function destroy($id)
    {
        return response()->json(['deleted' => $this->repo->delete($id)]);
    }
}

