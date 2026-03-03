<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    /**
     * List attendance
     */
    public function index(Request $request): JsonResponse
    {
        $query = Attendance::query();

        // Filter by date
        if ($request->date) {
            $query->where('date', $request->date);
        }

        // Filter by date range
        if ($request->start_date && $request->end_date) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        // Filter by type
        if ($request->type && $request->type !== 'All') {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        $records = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        $data = collect($records->items())->map(fn($r) => $this->formatAttendance($r));

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
     * Today's attendance
     */
    public function today(): JsonResponse
    {
        $records = Attendance::where('date', today())
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $records->count(),
            'members' => $records->where('type', 'Member')->count(),
            'walkIns' => $records->where('type', 'Walk-in')->count(),
            'expired' => $records->where('type', 'Expired')->count(),
            'revenue' => $records->sum('price'),
        ];

        return $this->successResponse([
            'records' => $records->map(fn($r) => $this->formatAttendance($r)),
            'stats' => $stats,
        ]);
    }

    /**
     * Create attendance
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'memberId' => 'nullable|exists:users,id',
            'name' => 'required|string',
            'type' => 'required|in:Member,Walk-in,Expired',
            'customerType' => 'required|in:Regular,Student',
            'paymentMethod' => 'required|in:Cash,GCash',
            'price' => 'required|numeric|min:0',
        ]);

        // Check duplicate for members
        if ($request->memberId && $request->type === 'Member') {
            $exists = Attendance::where('member_id', $request->memberId)
                ->where('date', today())
                ->exists();

            if ($exists) {
                return $this->errorResponse('Member already checked in today', 422);
            }
        }

        $attendance = Attendance::create([
            'member_id' => $request->memberId,
            'name' => $request->name,
            'type' => $request->type,
            'customer_type' => $request->customerType,
            'payment_method' => $request->paymentMethod,
            'price' => $request->price,
            'date' => today()->format('Y-m-d'),
            'time' => now()->format('H:i:s'),
            'recorded_by' => Auth::id(),
        ]);

        return $this->successResponse([
            'attendance' => $this->formatAttendance($attendance),
        ], 'Attendance recorded', 201);
    }

    /**
     * Get attendance
     */
    public function show($id): JsonResponse
    {
        $attendance = Attendance::find($id);
        
        if (!$attendance) {
            return $this->errorResponse('Not found', 404);
        }

        return $this->successResponse(['attendance' => $this->formatAttendance($attendance)]);
    }

    /**
     * Delete attendance
     */
    public function destroy($id): JsonResponse
    {
        $attendance = Attendance::find($id);
        
        if (!$attendance) {
            return $this->errorResponse('Not found', 404);
        }

        $attendance->delete();
        return $this->successResponse(null, 'Deleted');
    }

    /**
     * Stats
     */
    public function stats(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $monthRecords = Attendance::whereMonth('date', $month)
            ->whereYear('date', $year);

        $yearRecords = Attendance::whereYear('date', $year);

        return $this->successResponse([
            'today' => $this->getTodayStats(),
            'month' => [
                'total' => $monthRecords->count(),
                'members' => $monthRecords->clone()->where('type', 'Member')->count(),
                'walkIns' => $monthRecords->clone()->where('type', 'Walk-in')->count(),
                'expired' => $monthRecords->clone()->where('type', 'Expired')->count(),
                'revenue' => $monthRecords->sum('price'),
            ],
            'year' => [
                'total' => $yearRecords->count(),
                'revenue' => $yearRecords->sum('price'),
            ],
        ]);
    }

    /**
     * Daily revenue
     */
    public function dailyRevenue(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $data = Attendance::whereMonth('date', $month)
            ->whereYear('date', $year)
            ->selectRaw('date, SUM(price) as revenue, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $this->successResponse([
            'dailyRevenue' => $data->map(fn($d) => [
                'date' => $d->date->format('Y-m-d'),
                'revenue' => (float) $d->revenue,
                'count' => $d->count,
            ]),
        ]);
    }

    /**
     * Monthly revenue
     */
    public function monthlyRevenue(Request $request): JsonResponse
    {
        $year = $request->year ?? now()->year;

        $data = Attendance::whereYear('date', $year)
            ->selectRaw('MONTH(date) as month, SUM(price) as revenue, COUNT(*) as count')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $months = [1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April', 5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August', 9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'];

        return $this->successResponse([
            'monthlyRevenue' => $data->map(fn($d) => [
                'month' => $d->month,
                'monthName' => $months[$d->month],
                'revenue' => (float) $d->revenue,
                'count' => $d->count,
            ]),
        ]);
    }

    private function getTodayStats(): array
    {
        $records = Attendance::where('date', today());
        
        return [
            'total' => $records->count(),
            'members' => $records->clone()->where('type', 'Member')->count(),
            'walkIns' => $records->clone()->where('type', 'Walk-in')->count(),
            'expired' => $records->clone()->where('type', 'Expired')->count(),
            'revenue' => $records->sum('price'),
        ];
    }

    private function formatAttendance(Attendance $a): array
    {
        return [
            'id' => $a->id,
            'memberId' => $a->member_id,
            'name' => $a->name,
            'type' => $a->type,
            'customerType' => $a->customer_type,
            'paymentMethod' => $a->payment_method,
            'price' => (float) $a->price,
            'date' => $a->date->format('Y-m-d'),
            'time' => $a->time,
            'recordedBy' => $a->recorded_by,
        ];
    }
}