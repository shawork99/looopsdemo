<?php

namespace App\Http\Controllers;

use App\Repositories\RequestStatusRepository;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequestStatusController extends Controller
{
    public function __construct(protected RequestStatusRepository $requestStatusRepository)
    {
    }

    public function index(Request $request)
    {
        $input = $request->only([
            'search',
            'perPage',
            'page',
            'requestTypeId'
        ]);

        $validator = Validator::make($input, [
            'search' => 'max:50',
            'perPage' => 'required|integer',
            'page' => 'required|integer',
            'requestTypeId' => 'required|integer|exists:request_types,id'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->requestStatusRepository->getAll($input),
            'message' => 'Request status retrieved successfully'
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $input = $request->only([
            'code',
            'name',
            'sort_order',
            'background_color',
            'based_type',
            'request_type_id',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'code' => 'required|string|unique:request_status,code|max:15|min:1',
                'name' => 'required|max:100|min:1',
                'sort_order' => 'required|integer',
                'background_color' => 'required|string',
                'based_type' => 'required|string',
                'request_type_id' => 'required|integer|exists:request_types,id',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }

            $this->requestStatusRepository->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Request status created successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $requestStatusId)
    {
        $input = $request->only([
            'code',
            'name',
            'sort_order',
            'background_color',
            'based_type',
            'request_type_id',
            'is_active'
        ]);
        try {
            $validator = Validator::make($input, [
                'code' => 'required|string|min:1|max:15|unique:request_status,code,' . $requestStatusId, 'name' => 'required|max:100|min:1',
                'sort_order' => 'required|integer',
                'background_color' => 'required|string',
                'based_type' => 'required|string',
                'request_type_id' => 'required|integer|exists:request_types,id',
                'is_active' => 'required|boolean',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => $validator->getMessageBag()->first(),
                ], 400);
            }
            $requestStatus = $this->requestStatusRepository->find($requestStatusId, $input['request_type_id']);
            if (empty($requestStatus)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Request status not found',
                ], 404);
            }
            $requestStatus->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Request status update successfully'
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function show($requestStatusId)
    {
        $requestStatus = $this->requestStatusRepository->find($requestStatusId);
        if (empty($requestStatus)) {
            return response()->json([
                'success' => false,
                'message' => 'Request status not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Request status retrieved successfully',
            'data' => $requestStatus
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($requestStatusId)
    {
        $requestStatus = $this->requestStatusRepository->find($requestStatusId);
        if (empty($requestStatus)) {
            return response()->json([
                'success' => false,
                'message' => 'Request status not found',
            ], 404);
        }
        $requestStatus->delete();
        return response()->json([
            'success' => true,
            'message' => 'Request status deleted successfully'
        ], 200);
    }
}
