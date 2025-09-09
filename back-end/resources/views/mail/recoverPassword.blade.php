<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f7; color: #1c1c1e; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; padding: 40px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Reset Your Password</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-bottom: 30px; font-size: 16px; line-height: 1.5; color: #1c1c1e;">
                            Hi {{ $user->first_name }},<br><br>
                            We received a request to reset your Maploops account password. Click the button below to set a new password. This link will expire in 15 minutes.
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <a href="{{ $resetLink }}" target="_blank" style="display: inline-block; padding: 14px 28px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 6px; font-weight: 600;">
                                Reset Password
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 30px; font-size: 14px; line-height: 1.4; color: #6e6e73;">
                            If you did not request a password reset, you can safely ignore this email. Your account is secure.
                        </td>
                    </tr>
                    <tr>
                        <td style="padding-top: 20px; font-size: 14px; line-height: 1.4; color: #6e6e73;">
                            — The Maploops Team
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
