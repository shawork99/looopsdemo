<?php

namespace App\Http\Controllers;

use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Exception;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Repositories\CompanyRepository;


class ProfileDetailsController extends Controller
{
    protected UserRepository $UserRepository;
    protected CompanyRepository $CompanyRepository;

    public function __construct(UserRepository $UserRepository, CompanyRepository $CompanyRepository)
    {
        $this->UserRepository = $UserRepository;
        $this->CompanyRepository = $CompanyRepository;
    }

    public function index(Request $request)
        {
            try {
                $user = $request->user();

                $profile = $this->UserRepository->getProfileDetails($user->id);
                $leaveGroup = $this->UserRepository->getLeaveGroupDetails($user->id);
                $reoprtingManger = $this->UserRepository->getreportingManager($profile->details->reporting_manager_id);
                $company = $this->CompanyRepository->findForUser($user->id);

                if (!$profile) {
                    return response()->json([
                        'success' => false,
                        'message' => 'User not found',
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'data' => [
                        'id' => $profile->id,
                        'first_name' => $profile->first_name,
                        'password' => $profile->password,
                        'last_name' => $profile->last_name,
                        'email' => $profile->email,
                        'calling_name' => $profile->calling_name,
                        'employee_code' => $profile->details->employee_code ?? null,
                        'contact_no' => $profile->details->contact_no ?? null,
                        'address' => $profile->details->address ?? null,
                        'country' => $profile->details->country ?? null,
                        'department' => $profile->details->department['name'] ?? null,
                        'department_code' => $profile->details->department['code'] ?? null,
                        'designation' => $profile->details->designation['description'] ?? null,
                        'designation_code' => $profile->details->designation['title'] ?? null,
                        'profile_image' =>$profile->details->profile_image ?? null,
                        'shift'=>$profile->details->shift['code']??null,
                       'date_of_joined' => $profile->details->date_of_joined? Carbon::parse($profile->details->date_of_joined)->format('Y-m-d'): null,
                        'date_of_birth' =>$profile->details->date_of_birth??null,
                        'contact_number_office'=>$profile->details->contact_number_office??null,
                        'leave_type'=>$leaveGroup->leave_type??null,
                        'reoprting_manger' => $reoprtingManger->name??null,
                        'gender' =>$profile->details->gender??null,
                        'company_logo' => $company->company_logo ?? null,
                    ],
                    'message' => 'Profile loaded successfully',
                ], 200);

            } catch (\Exception $e) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                ], 400);
            }
        }


     public function changePassword(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'old_password' => 'required|string',
            'password' => [
                'required',
                'string',
                'confirmed',
                'min:6',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/'
            ],
        ], [
            'password.regex' => 'Password must be at least 6 characters and include: 
                1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.'
        ]);

        $result = $this->UserRepository->changePassword(
            $user->id,
            $data['old_password'],
            $data['password']
        );

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'],
        ], $result['success'] ? 200 : 422);
    }




}
