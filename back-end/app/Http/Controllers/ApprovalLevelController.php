<?php 
namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\ApprovalLevelRepository;
use App\Repositories\DocumentMasterRepository;
use App\Repositories\UserRepository;
use App\Repositories\RoleRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApprovalLevelController extends Controller
{
    protected $repo;

    public function __construct(
        ApprovalLevelRepository $repo,
        protected RoleRepository $roleRepository,
        protected DocumentMasterRepository $documentMasterRepository,
        protected UserRepository $userRepository
    ){
        $this->repo = $repo;
    }

    public function index(Request $request)
    {
        if ($request->has('formdata')) {
            return response()->json([
                'success' => true,
                'data' => $this->formData(),
                'message' => 'Approval level form data retrieved successfully'
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
                'message' => 'Approval level dara retrieved successfully'
            ], 200);
        }
    
    }

    public function formData(){
        return [
            'users' => $this->userRepository->getDropdown(),
            'roles' => $this->roleRepository->getRoleDropdown(),
            'documentMaster' => $this->documentMasterRepository->getDocumentMasterDropdown()
        ];
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'level',
            'approver_id',
            'approver_role_id',
            'document_system_id',
            'is_mandatory',
            'status'
        ]);
        try{
            $validator = Validator::make($input, [
                'level' => 'required|max:3|min:1',
                'approver_id' => 'required|integer',
                'document_system_id' => 'required|integer',
                'is_mandatory' => 'boolean',
                'status' => 'in:active,inactive'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            if($this->repo->checkLevelAlreadyExists($input)){
                return response()->json([
                    'success' => false,
                    'message' => 'Level ' . $input['level'] . ' already exists for this document type.',
                ], 404);
            }

            if (!$this->userRepository->exists($input['approver_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Approver not found',
                ], 404);
            }

            if (isset($input['approver_role_id']) && !$this->roleRepository->isActiveAndExists($input['approver_role_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found',
                ], 404);
            }

            if (!$this->documentMasterRepository->isActiveAndExists($input['document_system_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document system not found',
                ], 404);
            }

            if (!$this->repo->isLevelChangeValid($input['document_system_id'], $input['level'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid level. Levels must be added in order without skipping.',
                ], 400);
            }

            $create = $this->repo->create($input);
            if(!$create['success']){
                return response()->json([
                    'success' => false,
                    'message' => $create['message'] ?? 'Unable to create approval level.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Approval level created successfully'
            ], 200);

        } catch (\Exception $ex){
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
                'message' => 'Approval level details not found',
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Approval level details retrived successfully'
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $input = $request->only([
            'level',
            'approver_id',
            'approver_role_id',
            'document_system_id',
            'is_mandatory',
            'status'
        ]);
        try{
            $validator = Validator::make($input, [
                'level' => 'required|max:3|min:1',
                'approver_id' => 'required|integer',
                'document_system_id' => 'required|integer',
                'is_mandatory' => 'boolean',
                'status' => 'in:active,inactive'
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            if($this->repo->checkLevelAlreadyExists($input, $id)){
                return response()->json([
                    'success' => false,
                    'message' => 'Level ' . $input['level'] . ' already exists for this document type.',
                ], 404);
            }

            if (!$this->userRepository->exists($input['approver_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Approver not found',
                ], 404);
            }

            if (isset($input['approver_role_id']) && !$this->roleRepository->isActiveAndExists($input['approver_role_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found',
                ], 404);
            }

            if (!$this->documentMasterRepository->isActiveAndExists($input['document_system_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Document system not found',
                ], 404);
            }

            if (!$this->repo->isLevelChangeValid($input['document_system_id'], $input['level'], $id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid level. Levels must be added in order without skipping.',
                ], 400);
            }


            $create = $this->repo->update($id, $input);
            if(!$create['success']){
                return response()->json([
                    'success' => false,
                    'message' => $create['message'] ?? 'Unable to update approval level.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Approval level updated successfully'
            ], 200);
        } catch (\Exception $ex){
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }

    public function destroy($id)
    {
        $approvalLevel = $this->repo->find($id);
        if(empty($approvalLevel)){
            return response()->json([
                'success' => false,
                'message' => 'Approval level not found',
            ], 404);
        }

        if ($this->repo->hasNextLevel($approvalLevel->document_system_id, $approvalLevel->level)) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete level ' . $approvalLevel->level . ' as a higher level exists.',
            ], 400);
        }

        try{
            $approvlDelete = $this->repo->delete($id);
            if(!$approvlDelete['success']){
                return response()->json([
                    'success' => false,
                    'message' => $approvlDelete['message'] ?? 'Unable to delete approval level.',
                ], 400);
            }

            return response()->json([
                'success' => true,
                'message' => 'Approval level deleted successfully'
            ], 200);
        } catch (\Exception $ex){
            return response()->json([
                'success' => false,
                'message' => $ex->getMessage(),
            ], 400);
        }
    }
}
