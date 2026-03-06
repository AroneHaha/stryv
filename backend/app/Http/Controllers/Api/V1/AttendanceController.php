<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (!in_array($request->user()->role, ['Owner', 'Employee'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access',
                ], 403);
            }
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $query = Attendance::with(['user', 'recorder'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->date) {
            $query->whereDate('date', $request->date);
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        $attendances = $query->paginate($request->per_page ?? 15);

        return response()->json([
            'success' => true,
            'data' => $attendances,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'name' => 'required|string|max:255',
            'type' => 'required|in:Member,Walk-in,Expired',
            'customer_type' => 'required|in:Regular,Student',
            'payment_method' => 'required|in:Cash,GCash',
            'price' => 'required|numeric|min:0',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        $validated['recorded_by'] = $request->user()->id;

        $attendance = Attendance::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'data' => $attendance->load(['user', 'recorder']),
        ], 201);
    }

    public function show($id)
    {
        $attendance = Attendance::with(['user', 'recorder'])->find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $attendance,
        ]);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Attendance record not found',
            ], 404);
        }

        $attendance->delete();

        return response()->json([
            'success' => true,
            'message' => 'Attendance record deleted successfully',
        ]);
    }

    public function today(Request $request)
    {
        $attendances = Attendance::with(['user', 'recorder'])
            ->whereDate('date', today())
            ->orderBy('time', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $attendances,
        ]);
    }

    public function stats(Request $request)
    {
        $date = $request->date ?? today();

        $stats = [
            'total_today' => Attendance::whereDate('date', $date)->count(),
            'members_today' => Attendance::whereDate('date', $date)->where('type', 'Member')->count(),
            'walkins_today' => Attendance::whereDate('date', $date)->where('type', 'Walk-in')->count(),
            'revenue_today' => Attendance::whereDate('date', $date)->sum('price'),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}