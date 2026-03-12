<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Attendance;
use App\Models\User;
use App\Services\ActionLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberPortalController extends Controller
{
    public function profile(Request $request): JsonResponse
    {
        $member = $request->user();
        
        if ($member->role !== 'Member') {
            return $this->errorResponse('Access denied', 403);
        }

        // Check membership status
        $daysUntilExpiration = null;
        $isExpiringSoon = false;
        $isExpired = false;

        if ($member->expiration_date) {
            $now = now();
            $expiration = \Carbon\Carbon::parse($member->expiration_date);
            $daysUntilExpiration = $now->diffInDays($expiration, false);
            
            if ($daysUntilExpiration < 0) {
                $isExpired = true;
                // Update status if expired
                if ($member->status !== 'Expired') {
                    $member->update(['status' => 'Expired']);
                }
            } elseif ($daysUntilExpiration <= 7) {
                $isExpiringSoon = true;
            }
        }

        return $this->successResponse([
            'id' => $member->id,
            'name' => $member->name,
            'email' => $member->email,
            'phone' => $member->phone,
            'username' => $member->username,
            'customer_type' => $member->customer_type,
            'plan' => $member->plan,
            'start_date' => $member->start_date,
            'expiration_date' => $member->expiration_date,
            'status' => $member->status,
            'days_until_expiration' => $daysUntilExpiration,
            'is_expiring_soon' => $isExpiringSoon,
            'is_expired' => $isExpired,
        ]);
    }

    public function attendance(Request $request): JsonResponse
    {
        $member = $request->user();
        
        if ($member->role !== 'Member') {
            return $this->errorResponse('Access denied', 403);
        }

        $query = Attendance::where('member_id', $member->id)
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc');

        // Filter by month/year
        if ($request->has('month') && $request->month) {
            $query->whereMonth('date', $request->month);
        }
        if ($request->has('year') && $request->year) {
            $query->whereYear('date', $request->year);
        }

        $attendances = $query->paginate($request->per_page ?? 30);

        return $this->successResponse($attendances);
    }

    public function stats(Request $request): JsonResponse
    {
        $member = $request->user();
        
        if ($member->role !== 'Member') {
            return $this->errorResponse('Access denied', 403);
        }

        $year = $request->year ?? now()->year;

        // Monthly attendance count for the year (for GitHub-style calendar)
        $monthlyStats = Attendance::where('member_id', $member->id)
            ->whereYear('date', $year)
            ->selectRaw('MONTH(date) as month, COUNT(*) as count')
            ->groupBy('month')
            ->get()
            ->keyBy('month');

        // Total visits
        $totalVisits = Attendance::where('member_id', $member->id)->count();

        // This year visits
        $yearVisits = Attendance::where('member_id', $member->id)
            ->whereYear('date', $year)
            ->count();

        // This month visits
        $monthVisits = Attendance::where('member_id', $member->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->count();

        return $this->successResponse([
            'total_visits' => $totalVisits,
            'year_visits' => $yearVisits,
            'month_visits' => $monthVisits,
            'monthly_stats' => $monthlyStats,
            'year' => $year,
        ]);
    }

    public function checkIn(Request $request): JsonResponse
    {
        $member = $request->user();
        
        if ($member->role !== 'Member') {
            return $this->errorResponse('Access denied', 403);
        }

        // Check if already checked in today
        $existingCheckIn = Attendance::where('member_id', $member->id)
            ->whereDate('date', today())
            ->first();

        if ($existingCheckIn) {
            return $this->errorResponse('Already checked in today', 400);
        }

        // Check membership status
        $type = 'Member';
        $price = 0;

        if ($member->expiration_date && \Carbon\Carbon::parse($member->expiration_date)->isPast()) {
            $type = 'Expired';
            // Expired members pay walk-in rate
            $price = $member->customer_type === 'Regular' ? 400 : 320;
        } else {
            // Active members pay per-session rate
            $price = $member->customer_type === 'Regular' ? 160 : 128;
        }

        $attendance = Attendance::create([
            'member_id' => $member->id,
            'name' => $member->name,
            'type' => $type,
            'customer_type' => $member->customer_type,
            'payment_method' => 'Cash', // Default, can be updated later
            'price' => $price,
            'date' => today(),
            'time' => now()->format('H:i:s'),
            'recorded_by' => $member->id, // Self check-in
        ]);

        ActionLogService::log(ActionLog::ATTENDANCE_RECORDED, "Self check-in: {$member->name}", $attendance);

        return $this->successResponse($attendance, 'Check-in successful', 201);
    }
}