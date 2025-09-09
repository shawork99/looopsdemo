<?php
return [
    'navigation' =>   [
        [
            'key' => 'nav',
            'label' => 'MENU',
            'isTitle' => true,
            'collapsed' => false,
        ],
        [
            'key' => 'dashboard',
            'label' => 'Dashboard',
            'icon' => 'home',
            'collapsed' => false,
            'children' =>  [
                [
                    'key' =>  'dashboard-crm',
                    'label' => 'Attendence',
                    'url' => '/index',
                    'parentKey' => 'dashboard',
                ],
                [
                    'key' =>  'dashboard-analytics',
                    'label' => 'Leave',
                    'url' => '/analytics',
                    'parentKey' => 'dashboard',
                ]
            ]
        ],
        [
            'key' => 'general',
            'label' => 'General',
            'isTitle' => true,
            'collapsed' => false,
        ],
        [
            'key' => 'my_account',
            'label' => 'My Account',
            'icon' => 'package',
            'collapsed' => false,
            'children' =>  [
                [
                    'key' =>  'profile',
                    'label' => 'Profile',
                    'url' => '/profile',
                    'parentKey' => 'my_account',
                ],
                [
                    'key' =>  'in_out',
                    'label' => 'In / Out',
                    'url' => '/in-out',
                    'parentKey' => 'my_account',
                ],
                [
                    'key' => 'profile_leave',
                    'label' => 'Leave',
                    'url' => '/profile-leave',
                    'parentKey' => 'my_account',
                ],
                [
                    'key' => 'approvals',
                    'label' => 'Approvals',
                    'url' => '/approvals',
                    'parentKey' => 'my_account',
                ]
            ],
        ],
        [
            'key' => 'attendance',
            'label' => 'Attendance',
            'icon' => 'package',
            'collapsed' => false,
            'children' =>  [
                [
                    'key' =>  'day_attendence',
                    'label' => 'Day Attendance',
                    'url' => '/day-attendence',
                    'parentKey' => 'attendance',
                ],
                [
                    'key' =>  'shifts',
                    'label' => 'Shift',
                    'url' => '/shifts',
                    'parentKey' => 'attendance',
                ],
                [
                    'key' =>  'locations',
                    'label' => 'Locations',
                    'url' => '/locations',
                    'parentKey' => 'attendance',
                ],
                [
                    'key' =>  'attendance_history',
                    'label' => 'Attendance History',
                    'url' => '/attendance-history',
                    'parentKey' => 'attendance',
                ],
                [
                    'key' =>  'attendance_summary',
                    'label' => 'Attendance Summary',
                    'url' => '/attendance-summary',
                    'parentKey' => 'attendance',
                ],
            ]
        ],
        [
            'key' => 'leave',
            'label' => 'Leave',
            'icon' => 'package',
            'collapsed' => false,
            'children' =>  [
                [
                    'key' =>  'leaves',
                    'label' => 'Leaves',
                    'url' => '/leaves',
                    'parentKey' => 'leave',
                ],
                [
                    'key' =>  'leave_type',
                    'label' => 'Leave Types',
                    'url' => '/leave_types',
                    'parentKey' => 'leave',
                ],
                [
                    'key' =>  'leave_group',
                    'label' => 'Leave Groups',
                    'url' => '/leave_groups',
                    'parentKey' => 'leave',
                ],
                [
                    'key' =>  'leave_adjustment',
                    'label' => 'Leave Adjustment',
                    'url' => '/leave_adjustment',
                    'parentKey' => 'leave',
                ],
                [
                    'key' =>  'leave_report',
                    'label' => 'Leave Report',
                    'url' => '/leave_report',
                    'parentKey' => 'leave',
                ]
            ]
        ],
        [
            'key' => 'settings',
            'label' => 'Settings',
            'icon' => 'settings',
            'collapsed' => false,
            'children' =>  [
                [
                    'key' =>  'users',
                    'label' => 'Users',
                    'url' => '/users',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'designation',
                    'label' => 'Designation',
                    'url' => '/designation',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'departments',
                    'label' => 'Department',
                    'url' => '/departments',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'roles',
                    'label' => 'Role',
                    'url' => '/roles',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'navigation',
                    'label' => 'Navigation',
                    'url' => '/navigations',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'calendar_setup',
                    'label' => 'Calendar Setup',
                    'url' => '/calendar_setup',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'approval_levels',
                    'label' => 'Approval Levels',
                    'url' => '/approval_levels',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'customers',
                    'label' => 'Customers',
                    'url' => '/customers',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'request_status',
                    'label' => 'Request Status',
                    'url' => '/request-status',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'company_configuration',
                    'label' => 'Company Info',
                    'url' => '/company-configuration',
                    'parentKey' => 'settings',
                ],
                [
                    'key' =>  'suppliers',
                    'label' => 'Suppliers',
                    'url' => '/suppliers',
                    'parentKey' => 'settings',
                ]
            ]
        ],
    ],
    'permissions' => [
        [
            'label' => 'Grid',
            'key' => 'roles',
            'permission_name' => 'role_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'roles',
            'permission_name' => 'role_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'roles',
            'permission_name' => 'role_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'roles',
            'permission_name' => 'role_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'departments',
            'permission_name' => 'department_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'departments',
            'permission_name' => 'department_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'departments',
            'permission_name' => 'department_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'departments',
            'permission_name' => 'department_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'designation',
            'permission_name' => 'designation_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'designation',
            'permission_name' => 'designation_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'designation',
            'permission_name' => 'designation_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'designation',
            'permission_name' => 'designation_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'navigation',
            'permission_name' => 'navigation_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'navigation',
            'permission_name' => 'navigation_create',
        ],
        [
            'label' => 'Grid',
            'key' => 'request_status',
            'permission_name' => 'request_status_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'request_status',
            'permission_name' => 'request_status_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'request_status',
            'permission_name' => 'request_status_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'request_status',
            'permission_name' => 'request_status_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'approval_levels',
            'permission_name' => 'approval_levels_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'approval_levels',
            'permission_name' => 'approval_levels_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'approval_levels',
            'permission_name' => 'approval_levels_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'approval_levels',
            'permission_name' => 'approval_levels_delete',
        ],
        [
            'label' => 'Edit',
            'key' => 'profile',
            'permission_name' => 'profile_details',
        ],
        [
            'label' => 'Edit',
            'key' => 'company_configuration',
            'permission_name' => 'company_details_edit',
        ],
        [
            'label' => 'View',
            'key' => 'dashboard-crm',
            'permission_name' => 'dashboard-crm',
        ],
        [
            'label' => 'View',
            'key' => 'dashboard-analytics',
            'permission_name' => 'dashboard-analytics',
        ],
        [
            'label' => 'Grid',
            'key' => 'shifts',
            'permission_name' => 'shifts_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'shifts',
            'permission_name' => 'shifts_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'shifts',
            'permission_name' => 'shifts_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'shifts',
            'permission_name' => 'shifts_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'locations',
            'permission_name' => 'locations_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'locations',
            'permission_name' => 'locations_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'locations',
            'permission_name' => 'locations_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'locations',
            'permission_name' => 'locations_delete',
        ],
        [
            'label' => 'Grid',
            'key' => 'leave_type',
            'permission_name' => 'leave_type_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'leave_type',
            'permission_name' => 'leave_type_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'leave_type',
            'permission_name' => 'leave_type_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'leave_type',
            'permission_name' => 'leave_type_delete',
        ],

        [
            'label' => 'Grid',
            'key' => 'leave_group',
            'permission_name' => 'leave_group_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'leave_group',
            'permission_name' => 'leave_group_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'leave_group',
            'permission_name' => 'leave_group_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'leave_group',
            'permission_name' => 'leave_group_delete',
        ],

        [
            'label' => 'Grid',
            'key' => 'users',
            'permission_name' => 'users_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'users',
            'permission_name' => 'users_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'users',
            'permission_name' => 'users_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'users',
            'permission_name' => 'users_delete',
        ],

        [
            'label' => 'Grid',
            'key' => 'customers',
            'permission_name' => 'customers_grid',
        ],
        [
            'label' => 'Create',
            'key' => 'customers',
            'permission_name' => 'customers_create',
        ],
        [
            'label' => 'Edit',
            'key' => 'customers',
            'permission_name' => 'customers_edit',
        ],
        [
            'label' => 'Delete',
            'key' => 'customers',
            'permission_name' => 'customers_delete',
        ],



    ]
];
