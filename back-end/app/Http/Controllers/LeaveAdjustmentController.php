<?php

namespace App\Http\Controllers;

use App\Models\ApprovalLevel;
use App\Models\DocumentApproved;
use App\Models\LeaveAdjustment;
use App\Models\LeaveAdjustmentEmployee;
use Illuminate\Http\Request;
use App\Repositories\LeaveAdjustmentRepository;
use App\Repositories\LeaveGroupRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class LeaveAdjustmentController extends Controller
{
    protected $repo;
    protected $leaveGroupRepository;

    public function __construct(
        LeaveAdjustmentRepository $repo,
        LeaveGroupRepository $leaveGroupRepository
    ) {
        $this->repo = $repo;
        $this->leaveGroupRepository = $leaveGroupRepository;
    }

    public function index(Request $request)
    {
        if ($request->has('formdata')) {
            return response()->json([
                'success' => true,
                'data' => $this->formData(),
                'message' => 'Leave adjustment form data retrieved successfully'
            ], 200);
        } else {
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
                'data' => $this->repo->getAll($input),
                'message' => 'Leave adjustment dara retrieved successfully'
            ], 200);
        }
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'adjustment_date',
            'description',
            'leave_group_id',
            'policy_type'
        ]);
        try {
            $validator = Validator::make($input, [
                'adjustment_date' => 'required|date',
                'description' => 'required',
                'leave_group_id' => 'required',
                'policy_type' => 'required'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $checkExist = $this->repo->checkLeaveAdjNotApproved($input['leave_group_id']);
            if (!$checkExist['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $checkExist['message'],
                ], 400);
            }

            $create = $this->repo->create($input);
            if (!$create['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $create['message'] ?? 'Unable to create leave adjustment.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Leave Adjustment created successfully'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }

    public function show($id)
    {
        $user = $this->repo->find($id);
        if (empty($user)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave adjustment details not found',
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Leave adjustment details retrived successfully'
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $input = $request->only([
            'adjustment_date',
            'description',
            'leave_group_id',
            'policy_type',
            'confirmed_yn'
        ]);
        try {
            $validator = Validator::make($input, [
                'adjustment_date' => 'required|date',
                'description' => 'required',
                'leave_group_id' => 'required',
                'policy_type' => 'required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $leaveAdjustment = LeaveAdjustment::where('id', $id)->first();
            if (empty($leaveAdjustment)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave adjustment not found',
                ], 400);
            }

            $checkExist = $this->repo->checkLeaveAdjNotApproved($input['leave_group_id'], $id);
            if (!$checkExist['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $checkExist['message'],
                ], 400);
            }

            if ($input['confirmed_yn'] == 1) {
                $approvalLevel = ApprovalLevel::getApprovalLevel(2);
                if ($approvalLevel->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot confirm this document. Approval levels not added.',
                    ], 400);
                }

                $leaveAdjustmentDetails = LeaveAdjustmentEmployee::getLeaveAdjustmentEmployeeDetails($id);
                if ($leaveAdjustmentDetails->isEmpty()) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Cannot confirm this document. Leave adjustment details no added',
                    ], 400);
                }

                $input['confirmed_date'] = now();
                $input['confirmed_by'] = auth()->id();

                foreach ($approvalLevel as $level) {
                    $insertApproval = [
                        'doument_id' => 2,
                        'document_system_id' => $id,
                        'document_system_code' => $leaveAdjustment['document_code'] ?? null,
                        'approver_id' => $level->approver_id,
                        'level' => $level->level,
                        'status' => 'pending approval',
                    ];
                    DocumentApproved::create($insertApproval);
                }
            }

            $update = $this->repo->update($id, $input);
            if (!$update['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $update['message'] ?? 'Unable to update leave adjustment.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Leave adjustment updated successfully'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }

    public function destroy($id)
    {
        $leaveAdjustment = $this->repo->find($id);
        if (empty($leaveAdjustment)) {
            return response()->json([
                'success' => false,
                'message' => 'Leave adjustment not found',
            ], 404);
        }

        if ($leaveAdjustment->confirmed_yn == 1) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete. This leave adjustment is confirmed.',
            ], 400);
        }
        if ($leaveAdjustment->approved_yn == 1) {
            return response()->json([
                'success' => false,
                'message' => 'Approved leave adjustment cannot be deleted.',
            ], 400);
        }

        if ($leaveAdjustment->leave_adjustment_employees()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'This leave adjustment is assigned to one or more employees and cannot be deleted.',
            ], 400);
        }


        try {
            $leaveAdjustmentDelete = $this->repo->delete($id);
            if (!$leaveAdjustmentDelete['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $leaveAdjustmentDelete['message'] ?? 'Unable to delete leave adjustment.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Leave adjustment deleted successfully'
            ], 200);
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }
    public function formData()
    {
        return [
            'leaveGroup' => $this->leaveGroupRepository->getDropdown(),
        ];
    }
}
