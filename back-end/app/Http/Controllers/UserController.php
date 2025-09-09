<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Designation;
use App\Models\Shift;
use App\Models\User;
use App\Models\UserDetails;
use App\Repositories\DepartmentRepository;
use App\Repositories\DesignationRepository;
use App\Repositories\LeaveGroupRepository;
use App\Repositories\LocationRepository;
use App\Repositories\RoleRepository;
use App\Repositories\ShiftRepository;
use App\Repositories\UserRepository;
use App\Traits\FileUploadTrait;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail; 
use App\Mail\RecoverPasswordMail;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;


class UserController extends Controller
{
    use FileUploadTrait;

    public function __construct(
        protected RoleRepository $roleRepository,
        protected DepartmentRepository $departmentRepository,
        protected DesignationRepository $designationRepository,
        protected ShiftRepository $shiftRepository,
        protected UserRepository $userRepository,
        protected LeaveGroupRepository $leaveGroupRepository,
        protected LocationRepository $locationRepository
    ) {}


    public function index(Request $request)
    {
        if ($request->has('formdata')) {
            return response()->json([
                'success' => true,
                'data' => $this->formData(),
                'message' => 'Users created successfully'
            ], 200);
        } else {
            $input = $request->only([
                'search',
                'perPage',
                'page',
                'department_id',
                'designation_id',
                'manager_id',
                'location_id'
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
                'data' => $this->userRepository->getAll($input),
                'message' => 'Users created successfully'
            ], 200);
        }
    }

    private function formData()
    {
        $data['roles'] = $this->roleRepository->getRoleDropdown();
        $data['departments'] = $this->departmentRepository->getRoleDropdown();
        $data['designations'] = $this->designationRepository->getRoleDropdown();
        $data['shifts'] = $this->shiftRepository->getDropdown();
        $data['users'] = $this->userRepository->getDropdown();
        $data['leaveGroups'] = $this->leaveGroupRepository->getDropdown();
        $data['locations'] = $this->locationRepository->getDropdownList();
        return $data;
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'first_name',
            'last_name',
            'role_id',
            'email',
            'is_active',
            'password',
            'department_id',
            'designation_id',
            'password_confirmation',
            'gender'
        ]);
        try {
            $validator = Validator::make($input, [
                'first_name' => 'required|max:25|min:1',
                'last_name' => 'required|max:25|min:1',
                'role_id' => 'required|integer',
                'is_active' => 'required|boolean',
                'email' => 'required|email|max:30',
                'password' => ['required', 'confirmed', Password::min(6), 'max:12'],
                'department_id' => 'required|integer',
                'designation_id' => 'required|integer',
                'gender' => 'required|integer',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }
            if (!$this->roleRepository->isActiveAndExists($input['role_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found',
                ], 404);
            }
            if (!$this->departmentRepository->isActiveAndExists($input['department_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found',
                ], 404);
            }

            if ($this->userRepository->isEmailExists($input['email'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email is already exists',
                ], 400);
            }
            DB::beginTransaction();
            $this->userRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'User created successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($userId)
    {
        $user = $this->userRepository->findUserForEdit($userId);
        if (empty($user)) {
            return response()->json([
                'success' => false,
                'message' => 'User details not found',
            ], 400);
        }
        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Users details retrived successfully'
        ], 200);
    }

    public function update(Request $request, $userId)
    {
        $input = $request->only([
            'first_name',
            'last_name',
            'role_id',
            'email',
            'is_active',
            'department_id',
            'designation_id',
            'address',
            'calling_name',
            'contact_no',
            'country',
            'date_of_joined',
            'employee_code_reference',
            'id_number',
            'profile_image',
            'reporting_manager_id',
            'shift_id',
            'is_discharged',
            'leave_group_id',
            'location_id',
            'contact_number_office',
            'date_of_birth',
            'gender'
        ]);
        try {
            $validator = Validator::make($input, [
                'first_name' => 'required|max:25|min:1',
                'last_name' => 'required|max:25|min:1',
                'role_id' => 'required|integer',
                'is_active' => 'required|boolean',
                'email' => 'required|email|max:30|min:1',
                'department_id' => 'required|integer',
                'designation_id' => 'required|integer',
                'calling_name' => 'max:50',
                'id_number' => 'max:25',
                'employee_code_reference' => 'max:25',
                'contact_no' => 'max:20',
                'address' => 'max:150',
                'country' => 'max:20',
                'date_of_joined' => 'date|nullable',
                'contact_number_office' => 'max:20',
                'date_of_birth' => 'date|nullable',
                'gender' =>'required|integer',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }

            if ($this->userRepository->isEmailExists($input['email'], $userId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email is already exists',
                ], 400);
            }

            if (isset($input['profile_image'])) {
                if (!preg_match('/^data:image\/(jpeg|png);base64,/', $input['profile_image'])) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid image format. Only JPEG and PNG allowed.',
                    ], 400);
                }
                $maxSize = 5 * 1024 * 1024;
                if (strlen($input['profile_image']) > $maxSize) {
                    return response()->json(['error' => 'File size exceeds 5MB limit.'], 400);
                }
            }
            if (!$this->roleRepository->isActiveAndExists($input['role_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Role not found',
                ], 404);
            }

            if (isset($input['leave_group_id']) && !$this->leaveGroupRepository->isActiveAndExists($input['leave_group_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Leave group not found',
                ], 404);
            }

            if (isset($input['location_id']) && !$this->locationRepository->isActiveAndExists($input['location_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Location not found',
                ], 404);
            }

            $department = Department::select('id', 'code', 'name')->where('id', $input['department_id'])->first();

            if (empty($department)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Department not found',
                ], 404);
            }
            $input['department'] = $department;

            $designation = Designation::select('id', 'title', 'description')->where('id', $input['designation_id'])->first();

            if (empty($designation)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Designation not found',
                ], 404);
            }
            $input['designation'] = $designation;

            if (isset($input['reporting_manager_id']) && !$this->userRepository->exists($input['reporting_manager_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reporting manager not found',
                ], 404);
            }
            if (isset($input['shift_id'])) {
                $shift = Shift::select('id', 'code', 'name')->where('id', $input['shift_id'])->first();
                if (empty($shift)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Shift not found',
                    ], 404);
                }
                $input['shift'] = $shift;
            }


            DB::beginTransaction();
            if (isset($input['profile_image'])) {
                $input['profile_image'] =  $this->uploadBase64FileUsingSystemUser($input['profile_image']);
            }
            $this->userRepository->update($input, $userId);
            return response()->json([
                'success' => true,
                'message' => 'User update successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function resetUserPassword(Request $request)
    {
        $input = $request->only([
            'user_id',
            'password',
            'password_confirmation'
        ]);

        $validator = Validator::make($input, [
            'user_id' => 'required|integer',
            'password' => ['required', 'confirmed', Password::min(6), 'max:12'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }

        try {
            $this->userRepository->updateUserPassword($input['user_id'], $input['password']);
            return response()->json([
                'success' => true,
                'message' => 'Password update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function destroy($userId)
    {
        $user = $this->userRepository->find($userId);
        if (empty($user)) {
            return response()->json([
                'success' => false,
                'message' => 'User details not found',
            ], 404);
        }
        try {
            DB::beginTransaction();
            $user->delete();
            UserDetails::where('user_id', $userId)->delete();
            DB::commit();
            tenancy()->central(function () use ($userId) {
                //create records in main database
                User::where('tenant_user_id', $userId)->delete();
            });
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);
        } catch (Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
    public function getApproverRoleID($id) {
        try{
            $userDetails = $this->userRepository->getUserData($id);
            if(empty($userDetails)){
                return response()->json([
                    'success' => false,
                    'message' => 'Approver not found',
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $userDetails->role_id,
                'message' => 'Approver role retrieved successfully'
            ], 200);
        } catch (Exception $execption){
            return response()->json([
                'success' => false,
                'message' => $execption->getMessage(),
            ], 400);
        }
    }

    public function sendPasswordMail($userId){

        $user = User::find($userId);
        
        if(empty($user)){
            return response()->json([
                'success' => false,
                'message' => 'User not found',
            ], 404);
        }

        // Check if a token was already sent within 10 minutes
       $existing = DB::connection('mysql')->table('password_reset_tokens')
                ->where('email', $user->email)
                ->latest('created_at')
                ->first();

        if ($existing && Carbon::parse($existing->created_at)->gt(Carbon::now()->subMinutes(10))) {
            return response()->json([
                'success' => false,
                'message' => 'A reset link has already been sent. Please check your email.',
            ]);
        }

        // Generate new token
        $randomString = Str::random(40);
        $token = hash('sha256', $randomString . $user->email . now());

        // Save token
        DB::connection('mysql')->table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );

        // Encrypt payload for frontend
        $payload = json_encode(['email' => $user->email, 'token' => $token]);
        $encryptedPayload = encrypt($payload);

        $resetLink = config('app.frontend_url') . "/reset-password/{$encryptedPayload}";
        

        // Send mail
        Mail::to($user->email)->send(new \App\Mail\RecoverPasswordMail($user, $resetLink));

        return response()->json([
            'success' => true,
            'message' => 'A password reset link has been sent to the user email. Please check the email within 10 minutes.',
        ], 200);

    }


    public function userDetailExcel(Request $request){

        $filters = $request->only([
            'search', 'department_id', 'designation_id', 'manager_id', 'location_id'
        ]);

        $users = $this->userRepository->getAllForExcel($filters);

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header row
        $sheet->setCellValue('A1', 'Employee Code');
        $sheet->setCellValue('B1', 'First Name');
        $sheet->setCellValue('C1', 'Last Name');
        $sheet->setCellValue('D1', 'Date of Birth');
        $sheet->setCellValue('E1', 'Gender');
        $sheet->setCellValue('F1', 'Email');
        $sheet->setCellValue('G1', 'Contact');
        $sheet->setCellValue('H1', 'Address');
        $sheet->setCellValue('I1', 'Country');
        $sheet->setCellValue('J1', 'Date of Join');
        $sheet->setCellValue('K1', 'Department');
        $sheet->setCellValue('L1', 'Designation');
        $sheet->setCellValue('M1', 'Manager');
        $sheet->setCellValue('N1', 'Location');
        $sheet->setCellValue('O1', 'Status');

        $sheet->getRowDimension(1)->setRowHeight(30);
        $columns = [
            'A'=>15,'B'=>15,'C'=>15,'D'=>12,'E'=>10,'F'=>25,'G'=>15,
            'H'=>30,'I'=>15,'J'=>15,'K'=>20,'L'=>20,'M'=>25,'N'=>20,'O'=>10
        ];
        foreach ($columns as $col => $width) {
            $sheet->getColumnDimension($col)->setWidth($width);
        }

        // Make header row bold and center-aligned
        $sheet->getStyle('A1:O1')->getFont()->setBold(true);
        $sheet->getStyle('A1:O1')->getAlignment()->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)
        ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);

        $row = 2;
        foreach ($users->get() as $user) { 

            $sheet->setCellValue('A'.$row, $user->details->employee_code ?? '');
            $sheet->setCellValue('B'.$row, $user->first_name ?? '');
            $sheet->setCellValue('C'.$row, $user->last_name ?? '');
            $sheet->setCellValue('D'.$row, $user->details->date_of_birth ?? '');
            $sheet->setCellValue('E'.$row, $user->details->gender == 1 ? 'Male' : 'Female');
            $sheet->setCellValue('F'.$row, $user->email ?? '');
            $sheet->setCellValue('G'.$row, $user->details->contact_no ?? '');
            $sheet->setCellValue('H'.$row, $user->details->address ?? '');
            $sheet->setCellValue('I'.$row, $user->details->country ?? '');
            $sheet->setCellValue('J'.$row, $user->details->date_of_joined ? Carbon::parse($user->details->date_of_joined)->format('Y-m-d') : '');
            $sheet->setCellValue('K'.$row, $user->details->department['name'] ?? '');
            $sheet->setCellValue('L'.$row, $user->details->designation['description'] ?? '');
            $sheet->setCellValue('M'.$row, ($user->details->reportingManager->first_name ?? '') . ' ' . ($user->details->reportingManager->last_name ?? ''));
            $sheet->setCellValue('N'.$row, $user->details->location->location_name ?? '');
            $sheet->setCellValue('O'.$row, $user->is_active ? 'Active' : 'Inactive');
            $row++;
        }

        $writer = new Xlsx($spreadsheet);
        $fileName = 'User Details. (' . now()->format('Y-m-d H.i.s') . ').xlsx';

        return response()->streamDownload(function() use ($writer) {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]);
    }
}
