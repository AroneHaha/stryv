<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberPortalController extends Controller
{
    /**
     * Get profile
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return $this->successResponse([
            'member' => [
                'id' => $user->id,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'name' => $user->name,
                'email' => $user->email,
                'customerType' => $user->customer_type,
                'plan' => $user->plan,
                'startDate' => $user->start_date?->format('Y-m-d'),
                'expirationDate' => $user->expiration_date?->format('Y-m-d'),
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Get attendance history
     */
    public function attendance(Request $request): JsonResponse
    {
        $user = $request->user();

        $records = Attendance::where('member_id', $user->id)
            ->orWhere('name', $user->name)
            ->orderBy('date', 'desc')
            ->paginate($request->per_page ?? 20);

        $data = collect($records->items())->map(fn($r) => [
            'id' => $r->id,
            'date' => $r->date->format('Y-m-d'),
            'time' => $r->time,
            'type' => $r->type,
        ]);

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $records->currentPage(),
                'last_page' => $records->lastPage(),
                'per_page' => $records->perPage(),
                'total' => $records->total(),
            ],
        ]);
    }

    /**
     * Get stats
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Attendance::where('member_id', $user->id)
            ->orWhere('name', $user->name);

        $totalVisits = $query->count();
        $todayVisits = $query->clone()->where('date', today())->count();
        $monthVisits = $query->clone()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->count();

        $streak = $this->calculateStreak($user);

        $attendanceDates = Attendance::where('member_id', $user->id)
            ->orWhere('name', $user->name)
            ->distinct('date')
            ->pluck('date')
            ->map(fn($d) => $d->format('Y-m-d'));

        return $this->successResponse([
            'stats' => [
                'totalVisits' => $totalVisits,
                'todayVisits' => $todayVisits,
                'monthVisits' => $monthVisits,
                'streak' => $streak,
            ],
            'attendanceDates' => $attendanceDates,
        ]);
    }

    /**
     * Calendar
     */
    public function calendar(Request $request): JsonResponse
    {
        $user = $request->user();

        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $dates = Attendance::where('member_id', $user->id)
            ->orWhere('name', $user->name)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->distinct('date')
            ->pluck('date')
            ->map(fn($d) => $d->format('Y-m-d'));

        return $this->successResponse([
            'month' => (int) $month,
            'year' => (int) $year,
            'attendanceDates' => $dates,
        ]);
    }

    /**
     * Self check-in
     */
    public function checkIn(Request $request): JsonResponse
    {
        $user = $request->user();

        // Check if expired
        if ($user->expiration_date && $user->expiration_date < now()) {
            return $this->errorResponse('Membership expired', 403);
        }

        // Check duplicate today
        $exists = Attendance::where('member_id', $user->id)
            ->where('date', today())
            ->exists();

        if ($exists) {
            return $this->errorResponse('Already checked in today', 422);
        }

        $attendance = Attendance::create([
            'member_id' => $user->id,
            'name' => $user->name,
            'type' => 'Member',
            'customer_type' => $user->customer_type,
            'payment_method' => 'N/A',
            'price' => 0,
            'date' => today()->format('Y-m-d'),
            'time' => now()->format('H:i:s'),
            'recorded_by' => $user->id,
        ]);

        return $this->successResponse([
            'attendance' => [
                'id' => $attendance->id,
                'date' => $attendance->date->format('Y-m-d'),
                'time' => $attendance->time,
            ],
        ], 'Check-in successful!', 201);
    }

    private function calculateStreak($user): int
    {
        $dates = Attendance::where('member_id', $user->id)
            ->orWhere('name', $user->name)
            ->distinct('date')
            ->orderBy('date', 'desc')
            ->pluck('date');

        if ($dates->isEmpty()) return 0;

        $streak = 0;
        $checkDate = today();

        foreach ($dates as $date) {
            if ($date->format('Y-m-d') === $checkDate->format('Y-m-d')) {
                $streak++;
                $checkDate->subDay();
            } elseif ($streak === 0 && $date->format('Y-m-d') === $checkDate->copy()->subDay()->format('Y-m-d')) {
                $streak++;
                $checkDate->subDay()->subDay();
            } else {
                break;
            }
        }

        return $streak;
    }
}