<?php
namespace App\Repositories;

use App\Models\CalendarSetup;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CalendarSetupRespository
{
    public function getAll()
    {
        return CalendarSetup::query()
            ->select(['id', 'title', 'event_type', 'date'])
            ->orderBy('date', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'start' => $item->date,
                    'className' => $item->event_type === 'event' ? 'event-primary' : 'event-danger',
                    'textClass' => $item->event_type === 'event' ? 'text-warning' : 'text-secondary',
                ];
            });
    }

    public function find($id)
    {
        return CalendarSetup::select('id', 'title', 'date', 'event_type')->find($id);
    }

    public function create(array $data)
    {
        try{
            return DB::transaction(function () use ($data) {
                CalendarSetup::create($data);
                return [
                    'success' => true,
                    'message' => 'Successfully created'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function update($id, array $data)
    {
        try{
            return DB::transaction(function () use ($id, $data) {
                $calendarUpdate = CalendarSetup::findOrFail($id);
                $calendarUpdate->update($data);
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }

    public function delete($id)
    {
        try{
            return DB::transaction(function () use ($id) {
                CalendarSetup::where('id', $id)->delete();
                return [
                    'success' => true,
                    'message' => 'Successfully updated'
                ];
            });
        } catch (\Exception $ex){
            return [
                'success' => false,
                'message' => 'Unexpected Error: ' . $ex->getMessage()
            ];
        }
    }
    public function checkHolidayExistsForSameDay($input, $id=0){
        $date = Carbon::parse($input['date'])->toDateString();
        $eventType = strtolower(trim($input['event_type']));

        return CalendarSetup::whereDate('date', $date)
                    ->where('event_type', $eventType)
                    ->when($id > 0, function ($q) use ($id) {
                        $q->where('id', '!=', $id);
                    })
                    ->exists();
    }
}