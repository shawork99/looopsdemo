<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\UserDetails;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Stancl\Tenancy\Tenancy;
use App\Mail\WishMail;

class SendWishes extends Command
{
    protected $signature = 'app:send-wishes';
    protected $description = 'Send birthday and anniversary wishes to users';
    protected Tenancy $tenancy;

    public function __construct(Tenancy $tenancy)
    {
        parent::__construct();
        $this->tenancy = $tenancy;
    }

    public function handle()
    {
        $today = Carbon::now()->format('m-d');

        // Get all tenants from main DB
        $tenants = \DB::table('tenants')->get();

        if ($tenants->isEmpty()) {
            $this->info("No tenants found.");
            return 0;
        }

        foreach ($tenants as $tenant) {
            $this->info("Initializing tenant: {$tenant->id}");
          
            $this->tenancy->initialize($tenant->id);

            // Get all users
            $users = UserDetails::with('user')->get();
            $company = \DB::table('company')->first();
            $companyName = $company->name ?? '';

            foreach ($users as $user) {
                $dob = $user->date_of_birth;
                $doj = $user->date_of_joined;
                $name = $user->user->first_name . ' ' . $user->user->last_name;
                $email = $user->user->email;

                $isBirthday = $dob && $today === Carbon::parse($dob)->format('m-d');
                $isAnniversary = $doj && $today === Carbon::parse($doj)->format('m-d');

                if (!$isBirthday && !$isAnniversary) {
                    continue;
                }

                //Message
                $messageText = '';
                if ($isBirthday && $isAnniversary) {
                    $years = Carbon::now()->year - Carbon::parse($doj)->year;
                    $subject = "🎉 Happy Birthday & Work Anniversary!";
                    $messageText = "
                        Warmest Wishes on Your Birthday and Work Anniversary!<br><br>
                        Today, we're thrilled to celebrate two special milestones with you at {$companyName} through our Maploops platform. Your birthday and {$years} year(s) of remarkable contributions make this a truly joyous occasion.<br><br>
                        Your dedication, creativity, and positive impact light up our workplace. May your day be filled with happiness, laughter, and cherished moments, and may the year ahead bring you continued success, health, and fulfillment.<br><br>
                        Thank you for being part of the Maploops journey. We're grateful to celebrate this special day with you.";
                } elseif ($isBirthday) {
                    $subject = " 🎉 Happy Birthday from Maploops!";
                    $messageText = "
                        Wishing you a very Happy Birthday from all of us at Maploops!<br><br>
                        We hope your day is filled with joy, laughter, and meaningful moments. May the year ahead bring you continued success, good health, and happiness in all that you do.<br><br>
                        Thank you for being part of the Maploops journey. We're grateful to celebrate this special day with you.";
                } elseif ($isAnniversary) {
                    $years = Carbon::now()->year - Carbon::parse($doj)->year;
                    $subject = "🎉 Congratulations on Your Work Anniversary!";
                    $messageText = "
                        Congratulations on reaching this incredible milestone in your journey with {$companyName}<br><br>
                        Completing {$years} year(s) is a testament to your dedication, hard work, and the positive impact you've made. At Maploops, we're honored to support professionals like you who continue to grow and inspire within their organizations.<br><br>
                        Here's to your continued success, and to many more achievements ahead. Wishing you a fulfilling year ahead in your career and beyond!";
                }

                $this->info("Sending wishes to: {$name}");

                // Send email
                Mail::to($email)->send(new WishMail($user, $messageText,$subject));
            }
        }

        $this->info("Wishes process completed.");
        return 0;
    }
}
