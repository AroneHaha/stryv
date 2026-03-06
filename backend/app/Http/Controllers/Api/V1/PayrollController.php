<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\ActionLog;
use App\Services\ActionLogService;

class PayrollController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Payroll::with(['employee', 'marker'])
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc');

        if ($request->has('month') && $request->month) {
            $query->where('month', $request->month);
        }

        if ($request->has('year') && $request->year) {
            $query->where('year', $request->year);
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('employee_id') && $request->employee_id) {
            $query->where('employee_id', $request->employee_id);
        }

        $payrolls = $query->paginate($request->per_page ?? 10);

        return $this->successResponse($payrolls);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:users,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020|max:2030',
        ]);

        $employee = User::find($validated['employee_id']);

        if (!in_array($employee->role, ['Owner', 'Employee'])) {
            return $this->errorResponse('Invalid employee', 400);
        }

        $exists = Payroll::where('employee_id', $validated['employee_id'])
            ->where('month', $validated['month'])
            ->where('year', $validated['year'])
            ->exists();

        if ($exists) {
            return $this->errorResponse('Payroll already exists for this period', 400);
        }

        $payroll = Payroll::create([
            'employee_id' => $employee->id,
            'employee_name' => $employee->name,
            'salary' => $employee->salary,
            'month' => $validated['month'],
            'year' => $validated['year'],
            'status' => 'Unpaid',
        ]);

        ActionLogService::log(ActionLog::PAYROLL_GENERATED, "Generated payroll for: {$employee->name} - {$validated['month']}/{$validated['year']}");
        return $this->successResponse($payroll->load(['employee', 'marker']), 'Payroll created successfully', 201);
    }

    public function show(Payroll $payroll): JsonResponse
    {
        return $this->successResponse($payroll->load(['employee', 'marker']));
    }

    public function markPaid(Request $request, Payroll $payroll): JsonResponse
    {
        if ($payroll->status === 'Paid') {
            return $this->errorResponse('Payroll already paid', 400);
        }

        $payroll->update([
            'status' => 'Paid',
            'paid_at' => now(),
            'marked_by' => $request->user()->id,
        ]);

        ActionLogService::log(ActionLog::PAYROLL_PAID, "Marked payroll as paid: {$payroll->employee_name}", $payroll);
        return $this->successResponse($payroll->load(['employee', 'marker']), 'Payroll marked as paid');
    }

    public function destroy(Payroll $payroll): JsonResponse
    {
        if ($payroll->status === 'Paid') {
            return $this->errorResponse('Cannot delete paid payroll', 400);
        }

        $payroll->delete();

        return $this->successResponse(null, 'Payroll deleted successfully');
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020|max:2030',
        ]);

        // Only Employees, NOT Owners
        $employees = User::where('role', 'Employee')
            ->where('status', 'Active')
            ->get();

        $created = 0;
        foreach ($employees as $employee) {
            $exists = Payroll::where('employee_id', $employee->id)
                ->where('month', $validated['month'])
                ->where('year', $validated['year'])
                ->exists();

            if (!$exists) {
                Payroll::create([
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'salary' => $employee->salary,
                    'month' => $validated['month'],
                    'year' => $validated['year'],
                    'status' => 'Unpaid',
                ]);
                $created++;
            }
        }

        return $this->successResponse([
            'created_count' => $created,
            'total_employees' => $employees->count(),
        ], "Generated {$created} payroll records");
    }

    public function stats(Request $request): JsonResponse
    {
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;

        $stats = [
            'total' => Payroll::where('month', $month)->where('year', $year)->count(),
            'unpaid' => Payroll::where('month', $month)->where('year', $year)->where('status', 'Unpaid')->count(),
            'paid' => Payroll::where('month', $month)->where('year', $year)->where('status', 'Paid')->count(),
            'total_amount' => Payroll::where('month', $month)->where('year', $year)->sum('salary'),
            'paid_amount' => Payroll::where('month', $month)->where('year', $year)->where('status', 'Paid')->sum('salary'),
        ];

        return $this->successResponse($stats);
    }
}