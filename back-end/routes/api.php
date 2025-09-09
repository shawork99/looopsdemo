<?php

use App\Http\Controllers\ApprovalLevelController;
use App\Http\Controllers\AuthAPIController;
use App\Http\Controllers\CalendarSetupController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\RequestStatusController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\LeaveGroupController;
use App\Http\Controllers\LeaveGroupDetailController;
use App\Http\Controllers\LeaveTypeController;
use App\Http\Controllers\LocationController;
use App\Models\ApprovalLevel;
use App\Http\Controllers\CompanyAPIController;
use App\Http\Controllers\DocumentApprovedController;
use App\Http\Controllers\LeaveAdjustmentController;
use App\Http\Controllers\ProfileDetailsController;
use App\Http\Controllers\LeaveAdjustmentEmployeeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ClockinoutController;


Route::middleware([
    'auth:sanctum',
    \App\Http\Middleware\InitializeTenancy::class
])->group(function () {
    Route::get('mydetails', [AuthAPIController::class, 'getMyDetails']);
    Route::resource('roles', RoleController::class);
    Route::resource('departments', DepartmentController::class);
    Route::resource('designation', DesignationController::class);
    Route::get('/logout', [AuthAPIController::class, 'logout']);
    Route::resource('navigations', NavigationController::class);
    Route::resource('users', UserController::class);
    Route::post('reset_user_password', [UserController::class, 'resetUserPassword']);
    Route::resource('shifts', ShiftController::class);
    Route::resource('request_status', RequestStatusController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('locations', LocationController::class);
    Route::get('/currencies', [CurrencyController::class, 'index']);
    Route::resource('leave_types', LeaveTypeController::class);
    Route::resource('leave_groups', LeaveGroupController::class);
    Route::resource('leave_group_details', LeaveGroupDetailController::class);
    Route::resource('customers', CustomerController::class);
    Route::resource('approval_level', ApprovalLevelController::class);
    Route::get('approver_role/{id}', [UserController::class, 'getApproverRoleID']);
    Route::resource('company_configuration', CompanyAPIController::class);
    Route::resource('calendar_setup', CalendarSetupController::class);
    Route::resource('profile', ProfileDetailsController::class);
    Route::post('profile_update/{id}', [ProfileDetailsController::class, 'changePassword']);
    Route::resource('leave_adjustment', LeaveAdjustmentController::class);
    Route::resource('suppliers', SupplierController::class);
    Route::post('clockinout', [ClockinoutController::class, 'store']);
    Route::get('clockinout_details', [ClockinoutController::class, 'details']);
    Route::get('get_attandace_stasus', [ClockinoutController::class, 'getstatusattd']);
    Route::get('get_all_clockin_and_out', [ClockinoutController::class, 'getallattdata']);

    Route::get('adjustmentFormData', [LeaveGroupDetailController::class, 'adjustmentFormData']);
    Route::prefix('leave_adjustment_employee')->group(function () {
        Route::get('{leaveAdjustmentId}/details', [LeaveAdjustmentEmployeeController::class, 'index']);
        Route::post('/', [LeaveAdjustmentEmployeeController::class, 'store']);
        Route::put('{id}', [LeaveAdjustmentEmployeeController::class, 'update']);
        Route::post('delete_employee_details', [LeaveAdjustmentEmployeeController::class, 'deleteEmployeeLeaveAdjustment']);
    });
    Route::prefix('document_approved')->group(function () {
        Route::get('', [DocumentApprovedController::class, 'index']);
        Route::post('approve', [DocumentApprovedController::class, 'approveDocument']);
    });
    Route::post('users/{user}/send-password-mail', [UserController::class, 'sendPasswordMail']);
    Route::post('users/excel', [UserController::class, 'userDetailExcel']);
    Route::get('wishes', [ClockinoutController::class, 'getWishes']);
});



Route::post('recoverPassword', [AuthAPIController::class, 'recoverPassword']);
Route::post('/reset-password', [AuthAPIController::class, 'resetPassword']);
Route::post('/verify-payload', [AuthAPIController::class, 'verifyPayload']);
Route::post('/login', [AuthAPIController::class, 'login']);
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Something went wrong',
    ], 401);
});
