<?php

namespace App\Http\Controllers;

use App\Models\LeaveGroupDetail;
use App\Models\UserDetails;
use App\Repositories\LeaveGroupRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class LeaveGroupController extends Controller
{
    public function __construct(
        protected LeaveGroupRepository $leaveGroupRepository
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
            'data' => $this->leaveGroupRepository->getAll($input),
            'message' => 'Leave group view successfully'
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
            if ($this->leaveGroupRepository->isCodeExists($input['code'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave type code is already exists',
                ], 400);
            }
            $this->leaveGroupRepository->create($input);
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
            $leaveGroup = $this->leaveGroupRepository->find($id);
            if (empty($leaveGroup)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave group details not found',
                ], 404);
            }
            $leaveGroup->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Leave group update successfully'
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
        $leaveGroup = $this->leaveGroupRepository->find($id);
        if (empty($leaveGroup)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave group details not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Leave group retrieved successfully',
            'data' => $leaveGroup
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $leaveGroup = $this->leaveGroupRepository->find($id);
            if (empty($leaveGroup)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave group details not found',
                ], 404);
            }
            if (UserDetails::where('leave_group_id', $id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave group details already pulled to users',
                ], 404);
            }
            DB::beginTransaction();
            LeaveGroupDetail::where('leave_group_id', $id)->delete();

            $leaveGroup->delete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Leave group deleted successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}
