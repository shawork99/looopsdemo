<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Scopes\ActiveCompanyScope;
use App\Models\Scopes\FilterByAdminRoleScope;
use App\Models\User;
use App\Models\UserDetails;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail; 
use App\Mail\RecoverPasswordMail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;


class AuthAPIController extends Controller
{
    public function login(Request $request)
    {
        $input = $request->only([
            'email',
            'password'
        ]);
        $validator = Validator::make($input, [
            'email' => 'required|email|max:30|min:1',
            'password' => 'required|max:15|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 403);
        }
        try {
            if (Auth::attempt($input)) {
                $user = Auth::user();
                return response()->json([
                    'success' => true,
                    'message' => 'Login successfully',
                    'data' => [
                        'token' => $user->createToken(
                            'token-name',
                            ['*'],
                            now()->addWeek()
                        )->plainTextToken
                    ],
                ], 200);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'User name or password is invalid',
                ], 403);
            }
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function getMyDetails(Request $requet)
    {
        $user = Auth::user();
        $role = Role::select(
            'navigations',
            'permissions'
        )->withoutGlobalScopes([new ActiveCompanyScope, new FilterByAdminRoleScope])->where('id', $user->role_id)->first();
        if (empty($role)) {
            return response()->json([
                'success' => false,
                'message' => 'User configuration is invalid : Role not found',
            ], 403);
        }
        $permission =  json_decode($role->permissions);
        if (empty($permission)) {
            return response()->json([
                'success' => false,
                'message' => 'Permissions not found',
            ], 500);
        }

        if (empty($role->navigations)) {
            return response()->json([
                'success' => false,
                'message' => 'Navigations not found',
            ], 500);
        }

        if (empty($permission) || count($permission) > 0) {
            $permission =  collect($permission)->pluck('permission_name');
        }
        $userDetails = UserDetails::select('id', 'profile_image','gender')->where('user_id', $user->id)->first();
        return response()->json([
            'success' => true,
            'message' => 'Login successfully',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'profile_image' => isset($userDetails, $userDetails->profile_image) ? $userDetails->profile_image : null,
                    'gender' =>$userDetails->gender
                ],
                'navigation' => json_decode($role->navigations),
                'permissions' => json_encode($permission)
            ],
        ], 200);
    }

    public function logout(Request $requet)
    {
        $user = Auth::user();
        if ($user) {
            $user->tokens()->delete();
            return response()->json([
                'success' => true,
                'message' => 'Logout successfully',
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User details notfound',
            ], 404);
        }
    }

    public function recoverPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'The email you entered is not registered.',
            ], 404);
        }

        $existing = DB::table('password_reset_tokens')
        ->where('email', $user->email)
        ->first();

        if ($existing && Carbon::parse($existing->created_at)->gt(Carbon::now()->subMinutes(10))) {
            // Token already exists and is still valid
            return response()->json([
                'success' => false,
                'message' => 'A reset link has already been sent. Please check your email.',
            ],404);
        }

         // Generate token
        $randomString = Str::random(40);
        $token = hash('sha256', $randomString . $user->email . now());

        // Save token 
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );

        $payload = json_encode(['email' => $user->email, 'token' => $token]);
        $encryptedPayload = encrypt($payload); // encrypt 
        
        $frontendUrl = config('app.frontend_url'); 
        $encodedEmail = urlencode($user->email); 
        $resetLink = config('app.frontend_url') . "/reset-password/{$encryptedPayload}";

        //Send Mail
        Mail::to($user->email)->send(new RecoverPasswordMail($user, $resetLink));

        return response()->json([
            'success' => true,
            'message' => 'A password reset link has been sent to your email. Please check your email within 10 minutes.',
        ], 200);
    }

    public function showResetForm($encryptedPayload)
    {
        try {
            // decrypt the payload
            $decrypted = decrypt($encryptedPayload);       
            $data = json_decode($decrypted, true);
            $email = $data['email'];
            $token = $data['token'];

            // validate token
            $record = DB::table('password_reset_tokens')->where('email', $email)->first();
            if (!$record || !hash_equals($record->token, $token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'This reset link has expired. Please request another link by submitting your registered email again',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'message' => 'Valid link',
                'data' => ['email' => $email, 'token' => $token]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset link',
            ], 403);
        }
    }

    public function resetPassword(Request $request)
    {
        // Validate the request: payload and password
        $request->validate([
            'payload' => 'required|string',
            'password' => [
                'required',
                'string',
                'confirmed',
                'min:6',
                'regex:/[0-9]/',          
                'regex:/[A-Z]/',           
                'regex:/[a-z]/',       
                'regex:/[@$!%*?&]/',
            ],
        ]);

        // Decrypt payload
        $decrypted = decrypt($request->payload);
        $data = json_decode($decrypted, true);
        $email = $data['email'];
        $token = $data['token'];

        // Retrieve token record from DB
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record || !hash_equals($record->token, $token)) {
            return response()->json(['success' => false, 'message' => 'This reset link has expired. Please request another link by submitting your registered email again']);
        }
        

        if (Carbon::parse($record->created_at)->addMinutes(10)->isPast()) {
            return response()->json(['success' => false, 'message' => 'This reset link has expired. Please request another link by submitting your registered email again.']);
        }


        // Reset user password
        $user = User::where('email', $email)->first();
        $user->password = bcrypt($request->password);
        $user->save();

        // Delete token after successful reset
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }

    public function verifyPayload(Request $request)
    {
        try {
            $decrypted = decrypt($request->payload);
            $data = json_decode($decrypted, true);
            $email = $data['email'];
            $token = $data['token'];

            $record = DB::table('password_reset_tokens')->where('email', $email)->first();
            if (!$record || !hash_equals($record->token, $token)) {
               return response()->json(['valid' => false, 'message' => 'This reset link has expired. Please request another link by submitting your registered email again']);
            }

            if (Carbon::parse($record->created_at)->addMinutes(10)->isPast()) {
                return response()->json(['valid' => false, 'message' => 'This reset link has expired. Please request another link by submitting your registered email again']);
            }

            return response()->json(['valid' => true]);
        } catch (\Exception $e) {
            return response()->json(['valid' => false, 'message' => 'Invalid link']);
        }
    }

}
