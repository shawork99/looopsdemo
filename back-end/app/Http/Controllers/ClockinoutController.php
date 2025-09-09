<?php

namespace App\Http\Controllers;

use App\Repositories\ClockinoutRepository;
use App\Repositories\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Exception;

class ClockinoutController extends Controller
{
    public function __construct(protected ClockinoutRepository $clockinoutRepository,protected UserRepository $userRepository) {}

    public function store(Request $request)
    {
        $input = $request->only([
            'action_type',
            'latitude',
            'longitude',
            'comments',
            'device_type',
            'user_id'
        ]);

        try {
            // Validate inputs
            $validator = Validator::make($input, [
                'action_type' => 'required|in:clock_in,clock_out',
                'latitude'    => 'nullable|numeric',
                'longitude'   => 'nullable|numeric',
                'comments'    => 'nullable|string|max:255',
                'device_type' => 'required|string|max:50',
                'user_id'     => 'required|integer|exists:users,id'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag(),
                ], 400);
            }


            $shiftId = $this->clockinoutRepository->getshiftsdetials($input['user_id']);

            $data = [
                'action_type'   => $input['action_type'],
                'action_time'   => Carbon::now(),
                'latitude'      => $input['latitude'] ?? 0,
                'longitude'     => $input['longitude'] ?? 0,
                'location_name' => 'current location',
                'comments'      => $input['comments'] ?? '',
                'device_type'   => $input['device_type'],
                'company_id'    => Auth::user()->current_company_id,
                'user_id'       => $input['user_id'],
                'shift_id'      => $shiftId ?? 0
            ];

            // Insert record
            $this->clockinoutRepository->create($data);



            $caputre_clockinout_status =  $this->clockinoutRepository->captureclockinout_status($data);

            $message = $input['action_type'] === 'clock_in' ? 'Clock-in successfully' : 'Clock-out successfully';
            return response()->json([
                'success' => true,
                'message' =>  $message,
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function details(Request $request)
    {
        try {
            $user = $request->user();
            $companyId = $user->current_company_id;
            $userId = $user->id;

            // Get records filtered by current user and company
            $records = $this->clockinoutRepository->getLastTwoByUserAndCompany($userId, $companyId);

            return response()->json([
                'success' => true,
                'data' => $records,
                'message' => 'Your clock-in/out records loaded successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }


        public function getstatusattd(Request $request)
    {
        try {
            $user = $request->user();
            $companyId = $user->current_company_id;
            $userId = $user->id;

            
            $records = $this->clockinoutRepository->getshiftstasus($userId, $companyId);

            return response()->json([
                'success' => true,
                'data' => $records,
                'message' => 'Attandance Status loaded successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }


      public function getallattdata(Request $request)
    {
        try {
            $user = $request->user();
            $companyId = $user->current_company_id;
            $userId = $user->id;

            
            $records = $this->clockinoutRepository->getallattdata($userId, $companyId);

            return response()->json([
                'success' => true,
                'data' => $records,
                'message' => 'Attandance Status loaded successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function getWishes(Request $request){

        try {
            $user = $request->user();
            $companyId = $user->current_company_id;
            $userId = $user->id;

            // Today's celebration for user 
           $userMessage = $this->getUserCelebrationMessage($userId, $companyId);

            // Today's celebration for Other users 
           $otherMessage = $this->getOtherCelebrantsMessage($userId, $companyId);

            return response()->json([
                'success' => true,
                'data' => [
                    'user_message' => $userMessage,
                    'other_message' => $otherMessage
                ],
                'message' => 'Celebration messages loaded successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 400);
        }

    }

     protected function getUserCelebrationMessage($userId, $companyId)
    {
        $celebration = $this->userRepository->getTodayCelebrationForUser($userId, $companyId);
        if (!$celebration) {
            return null;
        }

        $dob = $celebration->date_of_birth;
        $doj = $celebration->date_of_joined;
        $today = now()->format('m-d');

        $isBirthday = $dob && $today === Carbon::parse($dob)->format('m-d');
        $isAnniversary = $doj && $today === Carbon::parse($doj)->format('m-d');

        if ($isBirthday && $isAnniversary) {
            $years = now()->year - Carbon::parse($doj)->year;
            return "🎉 Happy Birthday & Work Anniversary! Wishing you a fantastic day celebrating both your special day and $years year(s) of amazing contributions!";
        } elseif ($isBirthday) {
            return "🎉 Happy Birthday! Wishing you a wonderful day filled with joy and success!";
        } elseif ($isAnniversary) {
            $years = now()->year - Carbon::parse($doj)->year;
            return "🏆 Happy Work Anniversary! Thank you for $years year(s) of dedication and hard work!";
        }

        return null;
    }

    protected function getOtherCelebrantsMessage($userId, $companyId)
    {
        $otherCelebrants = $this->userRepository->getTodayCelebrationsForOthers($userId, $companyId);
        $today = now()->format('m-d');

        $birthdayOnly = [];
        $anniversaryOnly = [];
        $both = [];

        foreach ($otherCelebrants as $u) {
            $dob = $u->date_of_birth;
            $doj = $u->date_of_joined;

            // Properly capitalize names
            $name = ucwords($u->user->first_name . ' ' . $u->user->last_name);

            $isBirthday = $dob && $today === Carbon::parse($dob)->format('m-d');
            $isAnniversary = $doj && $today === Carbon::parse($doj)->format('m-d');

            if ($isBirthday && $isAnniversary) {
                $years = now()->year - Carbon::parse($doj)->year;
                $both[] = [
                    'name'  => $name,
                    'years' => $years,
                ];
            } elseif ($isBirthday) {
                $birthdayOnly[] = $name;
            } elseif ($isAnniversary) {
                $years = now()->year - Carbon::parse($doj)->year;
                $anniversaryOnly[] = "$name's $years " . ($years > 1 ? 'years' : 'year') . "";
            }
        }

        $formatNames = function(array $names) {
            $count = count($names);
            if ($count === 0) return '';
            if ($count === 1) return $names[0];
            if ($count === 2) return $names[0] . ' and ' . $names[1];
            return implode(', ', array_slice($names, 0, -1)) . ', and ' . end($names);
        };

        $messages = [];

        if (!empty($birthdayOnly)) {
            $messages[] = "Today is " . $formatNames($birthdayOnly) . "'s birthday 🎉";
        }

        if (!empty($anniversaryOnly)) {
            $messages[] = "Today is " . $formatNames($anniversaryOnly) . " work anniversary 🎊";
        }

        if (!empty($both)) {
            $formatted = array_map(function ($item) {
                $yearLabel = $item['years'] > 1 ? 'years' : 'year';
                return "{$item['name']}'s birthday and {$item['years']} $yearLabel work anniversary";
            }, $both);

            $messages[] = "Today is " . $formatNames($formatted) . " 🎉🎊";
        }

        return implode("\n", $messages);
    }





}
