<?php

namespace App\Http\Controllers;

use App\Models\UserDetails;
use App\Repositories\DesignationRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DesignationController extends Controller
{
    public function __construct(protected DesignationRepository $designationRepository) {}

    public function index(Request $request)
    {
        $input = $request->only([
            'search',
            'perPage',
            'page'
        ]);

        $validator = Validator::make($input, [
            'search' => 'max:50',
            'perPage' => 'required|integer',
            'page' => 'required|integer'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $this->designationRepository->getAll($input),
            'message' => 'Designation retrieved successfully'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->only([
            'title',
            'description',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'title' => 'required|max:50|min:1',
                'description' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            if ($this->designationRepository->isTitleExists($input['title'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Designation title is already exists',
                ], 400);
            }
            $this->designationRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Designation created successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $designationId)
    {
        $input = $request->only([
            'title',
            'description',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'title' => 'required|max:50|min:1',
                'description' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $designation = $this->designationRepository->find($designationId);
            if (empty($designation)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Designation details not found',
                ], 404);
            }
            $designation->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Designation update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($designationId)
    {
        $designation = $this->designationRepository->find($designationId);
        if (empty($designation)) {
            return response()->json([
                'success' => false,
                'message' => 'Designation details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Designation retrieved successfully',
            'data' => $designation
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($designationId)
    {
        $designation = $this->designationRepository->find($designationId);
        if (empty($designation)) {
            return response()->json([
                'success' => false,
                'message' => 'Designation details not found',
            ], 404);
        }
        if (UserDetails::where('designation_id', $designationId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Designation already pulled to users',
            ], 404);
        }

        $designation->delete();
        return response()->json([
            'success' => true,
            'message' => 'Designation deleted successfully'
        ], 200);
    }
}
