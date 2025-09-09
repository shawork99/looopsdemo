<?php

namespace App\Http\Controllers;

use App\Models\LeaveGroupDetail;
use App\Repositories\LeaveTypeRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeaveTypeController extends Controller
{
    public function __construct(
        protected LeaveTypeRepository $leaveTypeRepository
    ) {}

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
            'data' => $this->leaveTypeRepository->getAll($input),
            'message' => 'Leave Type created successfully'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->only([
            'name',
            'code',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'code' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            if ($this->leaveTypeRepository->isCodeExists($input['code'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave type code is already exists',
                ], 400);
            }
            $this->leaveTypeRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Leave type created successfully'
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
    public function update(Request $request, $id)
    {
        $input = $request->only([
            'name',
            'code',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'name' => 'required|max:50|min:1',
                'code' => 'required|max:100|min:1',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }
            $leaveType = $this->leaveTypeRepository->find($id);
            if (empty($leaveType)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave type details not found',
                ], 404);
            }
            $leaveType->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Leave type update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($id)
    {
        $leaveType = $this->leaveTypeRepository->find($id);
        if (empty($leaveType)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Leave type retrieved successfully',
            'data' => $leaveType
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $leaveType = $this->leaveTypeRepository->find($id);
        if (empty($leaveType)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type details not found',
            ], 404);
        }
        if (LeaveGroupDetail::where('leave_type_id', $id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Leave type already pulled to leave group details',
            ], 404);
        }

        $leaveType->delete();
        return response()->json([
            'success' => true,
            'message' => 'Leave type deleted successfully'
        ], 200);
    }
}
