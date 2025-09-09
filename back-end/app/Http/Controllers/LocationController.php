<?php

namespace App\Http\Controllers;

use App\Models\UserDetails;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Repositories\LocationRepositoryInterface;
use Exception;

class LocationController extends Controller
{
    public function __construct(protected LocationRepositoryInterface $locations) {}

    public function index(Request $request)
    {
        $input = $request->only(['search', 'perPage', 'page']);

        $validator = Validator::make($input, [
            'search' => 'max:50',
            'perPage' => 'required|integer',
            'page' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->locations->getAll($input),
            'message' => 'Location list retrieved successfully'
        ], 200);
    }

    public function store(Request $request)
    {
        $input = $request->only([
            'location_code',
            'location_name',
            'latitude',
            'longitude',
            'radius',
            'is_active'
        ]);

        $validator = Validator::make($input, [
            'location_code' => 'required|max:15|min:1|unique:locations',
            'location_name' => 'required|max:100|min:1',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag()->first(),
            ], 400);
        }

        try {
            $this->locations->create($input);
            return response()->json([
                'success' => true,
                'message' => 'Location created successfully',
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $locationId)
    {
        $input = $request->only([
            'location_code',
            'location_name',
            'latitude',
            'longitude',
            'radius',
            'is_active'
        ]);

        $validator = Validator::make($input, [
            'location_code' => 'required|max:15|min:1',
            'location_name' => 'required|max:100|min:1',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'radius' => 'required|numeric',
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->getMessageBag(),
            ], 400);
        }

        $location = $this->locations->find($locationId);
        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }

        try {
            $location->update($input);
            return response()->json([
                'success' => true,
                'message' => 'Location updated successfully',
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($locationId)
    {
        $location = $this->locations->find($locationId);
        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Location retrieved successfully',
            'data' => $location
        ], 200);
    }

    public function destroy($locationId)
    {
        $location = $this->locations->find($locationId);
        if (!$location) {
            return response()->json([
                'success' => false,
                'message' => 'Location not found',
            ], 404);
        }
        if (UserDetails::where('location_id', $locationId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Location already pulled to users',
            ], 404);
        }

        $location->delete();
        return response()->json([
            'success' => true,
            'message' => 'Location deleted successfully',
        ], 200);
    }
}
