<?php

namespace App\Repositories;

use App\Models\Location;

class LocationRepository implements LocationRepositoryInterface
{
    public function create(array $data)
    {
        return Location::create($data);
    }

    public function getAll(array $filter)
    {
        return Location::select(
            'id',
            'location_code',
            'location_name',
            'latitude',
            'longitude',
            'radius',
            'is_active'
        )
            ->when(isset($filter['search']) && !empty($filter['search']), function ($query) use ($filter) {
                $search = $filter['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('location_code', 'like', "%{$search}%")
                        ->orWhere('location_name', 'like', "%{$search}%");
                });
            })
            ->orderBy('id', 'DESC')
            ->paginate($filter['perPage'] ?? 10);
    }

    public function find($id)
    {
        return Location::select(
            'id',
            'location_code',
            'location_name',
            'latitude',
            'longitude',
            'radius',
            'is_active'
        )->findOrFail($id);
    }

    public function update($id, array $data)
    {
        $location = Location::findOrFail($id);
        $location->update($data);
        return $location;
    }

    public function delete($id)
    {
        $location = Location::findOrFail($id);
        $location->delete();
    }

    public function isCodeExists(string $locationCode): bool
    {
        return Location::where('location_code', 1)->where('id', $id)->exists();
    }

    public function isActiveAndExists($id): bool
    {
        return Location::where('id', $id)->where('is_active', 1)->exists();
    }

    public function getDropdownList()
    {
        return Location::select('id', 'location_code', 'location_name')
            ->where('is_active', 1)
            ->orderBy('location_name', 'ASC')
            ->get();
    }
}
