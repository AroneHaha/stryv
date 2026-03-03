<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * List employees
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'Employee');

        // Search
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter status
        if ($request->status && $request->status !== 'All') {
            $query->where('status', $request->status);
        }

        // Filter position/role
        if ($request->position && $request->position !== 'All') {
            $query->where('position', $request->position);
        }

        $employees = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        $data = collect($employees->items())->map(fn($e) => $this->formatEmployee($e));

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
            ],
        ]);
    }

    /**
     * Get active employees
     */
    public function active(): JsonResponse
    {
        $employees = User::where('role', 'Employee')
            ->where('status', 'Active')
            ->orderBy('name')
            ->get();

        return $this->successResponse([
            'employees' => $employees->map(fn($e) => $this->formatEmployee($e)),
        ]);
    }

    /**
     * Create employee
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string',
            'role' => 'required|in:Trainer,Receptionist,Manager,Maintenance',
            'salary' => 'required|numeric|min:0',
            'password' => 'required|string|min:6',
        ]);

        $employee = User::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => 'Employee',
            'position' => $request->role,
            'salary' => $request->salary,
            'date_hired' => now()->format('Y-m-d'),
            'password' => Hash::make($request->password),
            'status' => 'Active',
        ]);

        return $this->successResponse([
            'employee' => $this->formatEmployee($employee),
        ], 'Employee created', 201);
    }

    /**
     * Get employee
     */
    public function show($id): JsonResponse
    {
        $employee = User::where('role', 'Employee')->find($id);
        
        if (!$employee) {
            return $this->errorResponse('Employee not found', 404);
        }

        return $this->successResponse(['employee' => $this->formatEmployee($employee)]);
    }

    /**
     * Update employee
     */
    public function update(Request $request, $id): JsonResponse
    {
        $employee = User::where('role', 'Employee')->find($id);
        
        if (!$employee) {
            return $this->errorResponse('Employee not found', 404);
        }

        $request->validate([
            'firstName' => 'sometimes|string',
            'lastName' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string',
            'role' => 'sometimes|in:Trainer,Receptionist,Manager,Maintenance',
            'salary' => 'sometimes|numeric|min:0',
        ]);

        $oldSalary = $employee->salary;

        $employee->update([
            'first_name' => $request->firstName ?? $employee->first_name,
            'last_name' => $request->lastName ?? $employee->last_name,
            'email' => $request->email ?? $employee->email,
            'phone' => $request->phone ?? $employee->phone,
            'position' => $request->role ?? $employee->position,
            'salary' => $request->salary ?? $employee->salary,
        ]);

        // Update unpaid payroll if salary changed
        if ($request->salary && $request->salary != $oldSalary) {
            \App\Models\Payroll::where('employee_id', $employee->id)
                ->where('status', 'Unpaid')
                ->update(['salary' => $request->salary]);
        }

        return $this->successResponse(['employee' => $this->formatEmployee($employee->fresh())]);
    }

    /**
     * Delete employee
     */
    public function destroy($id): JsonResponse
    {
        $employee = User::where('role', 'Employee')->find($id);
        
        if (!$employee) {
            return $this->errorResponse('Employee not found', 404);
        }

        $employee->delete();
        return $this->successResponse(null, 'Employee deleted');
    }

    /**
     * Toggle status
     */
    public function toggleStatus($id): JsonResponse
    {
        $employee = User::where('role', 'Employee')->find($id);
        
        if (!$employee) {
            return $this->errorResponse('Employee not found', 404);
        }

        $newStatus = $employee->status === 'Active' ? 'Inactive' : 'Active';
        $employee->update(['status' => $newStatus]);

        return $this->successResponse(['employee' => $this->formatEmployee($employee->fresh())]);
    }

    /**
     * Format employee (camelCase for frontend)
     */
    private function formatEmployee(User $employee): array
    {
        return [
            'id' => $employee->id,
            'firstName' => $employee->first_name,
            'lastName' => $employee->last_name,
            'name' => $employee->name,
            'email' => $employee->email,
            'phone' => $employee->phone,
            'role' => $employee->position,
            'salary' => (string) $employee->salary,
            'dateHired' => $employee->date_hired?->format('Y-m-d'),
            'status' => $employee->status,
        ];
    }
}