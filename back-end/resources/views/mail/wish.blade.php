<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Greetings</title>
</head>
<body>
    <p>Dear {{ $user->user->first_name }} {{ $user->user->last_name }},</p>

    {!! $messageText !!}

    <p>Warm regards,<br>Maploops Team</p>
    <p style="font-size: 12px; color: gray;">
      This is an automated message from the Maploops system.
    </p>
</body>
</html>
