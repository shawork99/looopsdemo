<?php

namespace App\Repositories;

use App\Models\Clockinout;
use App\Models\ShiftDetail;
use App\Models\UserDetails;
use App\Models\CalendarSetup;
use App\Models\Attandance_log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ClockinoutRepository
{
    public function __construct()
    {
        //
    }

    /**
     * Create clock-in/out record
     */
    public function create($data)
    {
        return Clockinout::create($data);
    }

    public function getLastTwoByUserAndCompany($userId, $companyId)
    {
        return Clockinout::select('id', 'action_type', 'action_time')
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->latest('action_time')
            ->take(2)
            ->get();
    }

    /**
     * Get shift id from user details
     */
    public function getshiftsdetials($userId)
    {
        $row = UserDetails::select('shift_id')
            ->where('user_id', $userId)
            ->first();

        return $row ? (int) $row->shift_id : null;
    }

    public function captureclockinout_status(array $data)
    {
        // required pieces
        $userId = $data['user_id'] ?? null;
        $shiftId = $data['shift_id'] ?? null;
        $companyId = $data['company_id'] ?? null;
        $actionType = $data['action_type'] ?? null;
        $actionTime = isset($data['action_time']) ? Carbon::parse($data['action_time']) : Carbon::now();

        if (!$userId || !$shiftId || !$actionType) {
            return null; 
        }

        $actionDate = $actionTime->toDateString();      
        $dayName = $actionTime->format('l');          

        $query = ShiftDetail::where('shift_id', $shiftId);
        if (!empty($companyId)) {
            $query->where('company_id', $companyId);
        }
        $shiftRows = $query->get();

        $matching = null;
        foreach ($shiftRows as $sr) {
            $dn = trim((string) $sr->day_name);

            $matched = false;
            $decoded = @json_decode($dn, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                foreach ($decoded as $val) {
                    if (is_string($val) && strcasecmp(trim($val), $dayName) === 0) {
                        $matched = true;
                        break;
                    }
                    if (is_array($val) && isset($val['day_name']) && strcasecmp(trim($val['day_name']), $dayName) === 0) {
                        $matched = true;
                        break;
                    }
                }
            } else {
                $parts = preg_split('/[,\|;]+/', $dn);
                foreach ($parts as $p) {
                    if (strcasecmp(trim($p), $dayName) === 0) {
                        $matched = true;
                        break;
                    }
                }
                if (!$matched && strcasecmp($dn, $dayName) === 0) {
                    $matched = true;
                }
            }

            if ($matched) {
                $matching = $sr;
                break;
            }
        }

        if (!$matching) {
            $matching = $shiftRows->first();
        }

        $isHoliday = CalendarSetup::whereDate('date', $actionDate)
            ->when($companyId, function ($q) use ($companyId) {
                return $q->where('company_id', $companyId);
            })
            ->where('event_type', 'hoilday')
            ->exists();
        $statusLabel = null;

        if ($isHoliday) {
            $statusLabel = 'Holiday';
        } elseif ($matching && isset($matching->is_week_day) && (int)$matching->is_week_day === 0) {
            $statusLabel = 'Weekend';
        } else {

            $startTimeText = $matching->start_time ?? null;
            $endTimeText = $matching->end_time ?? null;

            $start = null;
            $end = null;
            try {
                if (!empty($startTimeText)) {
                    $start = Carbon::parse($actionDate . ' ' . $startTimeText);
                }
                if (!empty($endTimeText)) {
                    $end = Carbon::parse($actionDate . ' ' . $endTimeText);
                }
            } catch (\Exception $e) {
                $start = null;
                $end = null;
            }

            if ($actionType === 'clock_in') {
                if ($start && $actionTime->lt($start)) {
                    $statusLabel = 'Early In';
                } elseif ($start && $actionTime->gt($start)) {
                    $statusLabel = 'Late In';
                } else {
                    $statusLabel = 'On Time In';
                }
            } else { // clock_out (or other)
                if ($end && $actionTime->lt($end)) {
                    $statusLabel = 'Early Out';
                } elseif ($end && $actionTime->gt($end)) {
                    $statusLabel = 'Late Out';
                } else {
                    $statusLabel = 'On Time Out';
                }
            }
        }


        $statusEntry = [
            'type' => $statusLabel,
            'action_type' => $actionType,
            'timestamp' => $actionTime->toDateTimeString(),
            'date' => $actionDate,
            'shift_id' => $shiftId,
        ];

  
        $existing = Attandance_log::where('user_id', $userId)
            ->where('shift_id', $shiftId)
            ->whereDate('date', $actionDate)
            ->first();

        if ($existing) {
            $existingStatuses = [];
            if (!empty($existing->status)) {
                $decoded = json_decode($existing->status, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $existingStatuses = $decoded;
                }
            }

            $existingStatuses[] = $statusEntry;

            Attandance_log::where('id', $existing->id)
                ->update([
                    'status' => json_encode($existingStatuses),
                    'updated_at' => Carbon::now(),
                ]);

            $recordId = $existing->id;
        } else {
   
            $new = [
                'user_id' => $userId,
                'shift_id' => $shiftId,
                'company_id' => $companyId,
                'date' => $actionDate,
                'status' => json_encode([$statusEntry]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];

            $recordId = Attandance_log::create($new);
        }

        // return info for caller
        return [
            'record_id' => $recordId,
            'status_entry' => $statusEntry,
        ];
    }

    public function getshiftstasus($userId, $companyId)
    {
        $today = Carbon::today()->toDateString();

        $row = Attandance_log::select('status', 'shift_id')
            ->where('user_id', $userId)
            ->where('company_id', $companyId)
            ->whereDate('date', $today)
            ->first();

        return $row;
    }


     public function getallattdata($userId, $companyId)
    {
        return Clockinout::select('id', 'action_type', 'action_time')
            ->where('company_id', $companyId)
            ->where('user_id', $userId)
            ->whereDate('action_time', '=', now()->toDateString()) 
            ->get();
    }


}
