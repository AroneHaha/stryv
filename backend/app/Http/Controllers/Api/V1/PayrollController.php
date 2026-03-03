<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PayrollController extends Controller
{
    /**
     * List payroll
     */
    public function index(Request $request): JsonResponse
    {
        $query = Payroll::query();

        if ($request->month && $request->month !== 'All') {
            $query->where('month', $request->month);
        }

        if ($request->year && $request->year !== 'All') {
            $query->where('year', $request->year);
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        if ($request->search) {
            $query->where('employee_name', 'like', "%{$request->search}%");
        }

        $records = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        $data = collect($records->items())->map(fn($p) => $this->formatPayroll($p));

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
     * Stats
     */
    public function stats(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $query = Payroll::where('month', $month)->where('year', $year);

        return $this->successResponse([
            'totals' => [
                'total' => $query->sum('salary'),
                'paid' => $query->clone()->where('status', 'Paid')->sum('salary'),
                'unpaid' => $query->clone()->where('status', 'Unpaid')->sum('salary'),
                'paidCount' => $query->clone()->where('status', 'Paid')->count(),
                'unpaidCount' => $query->clone()->where('status', 'Unpaid')->count(),
            ],
            'activeEmployees' => User::where('role', 'Employee')->where('status', 'Active')->count(),
        ]);
    }

    /**
     * Available years
     */
    public function years(): JsonResponse
    {
        $years = Payroll::select('year')
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->toArray();

        if (!in_array(now()->year, $years)) {
            $years[] = now()->year;
        }

        return $this->successResponse(['years' => array_values($years)]);
    }

    /**
     * Generate payroll for month
     */
    public function generate(Request $request): JsonResponse
    {
        $request->validate([
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer',
        ]);

        $employees = User::where('role', 'Employee')
            ->where('status', 'Active')
            ->get();

        $generated = 0;

        foreach ($employees as $employee) {
            $exists = Payroll::where('employee_id', $employee->id)
                ->where('month', $request->month)
                ->where('year', $request->year)
                ->exists();

            if (!$exists && $employee->date_hired <= now()->parse("{$request->year}-{$request->month}-01")) {
                Payroll::create([
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'salary' => $employee->salary,
                    'month' => $request->month,
                    'year' => $request->year,
                    'status' => 'Unpaid',
                ]);
                $generated++;
            }
        }

        return $this->successResponse(['generated' => $generated], "Generated {$generated} payroll records");
    }

    /**
     * Refresh payroll
     */
    public function refresh(): JsonResponse
    {
        $generated = 0;

        for ($i = 0; $i < 3; $i++) {
            $month = now()->month + $i;
            $year = now()->year;

            if ($month > 12) {
                $month -= 12;
                $year++;
            }

            $employees = User::where('role', 'Employee')
                ->where('status', 'Active')
                ->where('date_hired', '<=', now()->parse("{$year}-{$month}-01"))
                ->get();

            foreach ($employees as $employee) {
                $exists = Payroll::where('employee_id', $employee->id)
                    ->where('month', $month)
                    ->where('year', $year)
                    ->exists();

                if (!$exists) {
                    Payroll::create([
                        'employee_id' => $employee->id,
                        'employee_name' => $employee->name,
                        'salary' => $employee->salary,
                        'month' => $month,
                        'year' => $year,
                        'status' => 'Unpaid',
                    ]);
                    $generated++;
                }
            }
        }

        return $this->successResponse(['generated' => $generated], "Generated {$generated} payroll records");
    }

    /**
     * Get payroll
     */
    public function show($id): JsonResponse
    {
        $payroll = Payroll::find($id);
        
        if (!$payroll) {
            return $this->errorResponse('Not found', 404);
        }

        return $this->successResponse(['payroll' => $this->formatPayroll($payroll)]);
    }

    /**
     * Mark as paid
     */
    public function markPaid($id): JsonResponse
    {
        $payroll = Payroll::find($id);
        
        if (!$payroll) {
            return $this->errorResponse('Not found', 404);
        }

        if ($payroll->status === 'Paid') {
            return $this->errorResponse('Already paid', 422);
        }

        $payroll->update([
            'status' => 'Paid',
            'paid_at' => now(),
            'marked_by' => Auth::id(),
        ]);

        return $this->successResponse(['payroll' => $this->formatPayroll($payroll->fresh())]);
    }

    /**
     * Delete
     */
    public function destroy($id): JsonResponse
    {
        $payroll = Payroll::find($id);
        
        if (!$payroll) {
            return $this->errorResponse('Not found', 404);
        }

        if ($payroll->status === 'Paid') {
            return $this->errorResponse('Cannot delete paid payroll', 422);
        }

        $payroll->delete();
        return $this->successResponse(null, 'Deleted');
    }

    private function formatPayroll(Payroll $p): array
    {
        $months = [1 => 'January', 2 => 'February', 3 => 'March', 4 => 'April', 5 => 'May', 6 => 'June', 7 => 'July', 8 => 'August', 9 => 'September', 10 => 'October', 11 => 'November', 12 => 'December'];

        return [
            'id' => $p->id,
            'employeeId' => $p->employee_id,
            'employeeName' => $p->employee_name,
            'salary' => (float) $p->salary,
            'month' => $p->month,
            'year' => $p->year,
            'period' => ($months[$p->month] ?? '') . ' ' . $p->year,
            'status' => $p->status,
            'paidAt' => $p->paid_at?->toISOString(),
            'markedBy' => $p->marked_by,
        ];
    }
}