Hello {{ $admin->first_name }} {{ $admin->last_name }} ,

This is an important message for staff members. Please review the following information:
email : {{ $admin->email }}
password : {{ $admin->$password }}

Thank you.
