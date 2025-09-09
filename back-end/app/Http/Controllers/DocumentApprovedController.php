<?php

namespace App\Http\Controllers;

use App\Models\ApprovalLevel;
use App\Models\DocumentApproved;
use Illuminate\Http\Request;
use App\Repositories\DocumentApprovedRepository;
use App\Repositories\LeaveAdjustmentHistoryRepository;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DocumentApprovedController extends Controller
{
    public function __construct(
        protected DocumentApprovedRepository $repo,
        protected LeaveAdjustmentHistoryRepository $historyRepo
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
            'data' => $this->repo->getAll($input),
            'message' => 'Approval level dara retrieved successfully'
        ], 200);
    }
    public function approveDocument(Request $request)
    {
        $input = $request->only([
            'id',
            'doument_id',
            'document_system_id',
            'level',
            'comment'
        ]);

        $validator = Validator::make($input, [
            'doument_id' => 'required|integer',
            'document_system_id' => 'required|integer',
            'level' => 'required|integer',
            'comment' => 'nullable|string'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }

        try {
            $userID = Auth::user()->id;
            $docApproval = DocumentApproved::where('doument_id', $input['doument_id'])
                ->where('document_system_id', $input['document_system_id'])
                ->where('approver_id', $userID)
                ->where('level', $input['level'])
                ->where('status', 'pending approval')
                ->firstOrFail();
            return DB::transaction(function () use ($input, $docApproval) {
                $getMasterTable = $this->repo->getMasterTable($input['doument_id']);
                if (!$getMasterTable['success']) {
                    return response()->json([
                        'success' => false,
                        'message' => $getMasterTable['message'],
                    ], 400);
                }

                /** @var \Illuminate\Database\Eloquent\Model $masterTable */
                $masterTable = $getMasterTable['data'];
                $maxApprovalLevel = ApprovalLevel::where('document_system_id', $input['doument_id'])->where('status', '=', 'active')->max('level');

                $docApproval->action_date = Carbon::now();
                $docApproval->comment = $input['comment'] ?? null;
                $docApproval->status = 'approved';
                $docApproval->save();

                if ($input['level'] < $maxApprovalLevel) {
                    $masterTable::where('id', $input['document_system_id'])
                        ->update(['noOfLevel' => $input['level'] + 1]);
                } else {
                    $masterTable::where('id', $input['document_system_id'])
                        ->update([
                            'approved_yn' => 1,
                            'approved_by' => Auth::user()->id,
                            'approved_date' => Carbon::now(),
                            'noOfLevel' => $input['level']
                        ]);

                    if ($input['doument_id'] == 2) {
                        $leaveHistory = $this->historyRepo->leaveHistoty($input['document_system_id']);
                        if (!$leaveHistory['success']) {
                            return response()->json([
                                'success' => false,
                                'message' => $leaveHistory['message']
                            ]);
                        }
                    }
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Document approved successfully'
                ]);
            });
        } catch (\Exception $ex) {
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 500);
        }
    }
    public function rejectDcoument(Request $request) {}
}
