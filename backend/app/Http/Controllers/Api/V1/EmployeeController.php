<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::whereIn('role', ['Owner', 'Employee'])
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        if ($request->has('position') && $request->position) {
            $query->where('position', $request->position);
        }

        $employees = $query->paginate($request->per_page ?? 10);

        return $this->successResponse($employees);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|in:Trainer,Receptionist,Manager,Maintenance',
            'salary' => 'required|numeric|min:0',
            'date_hired' => 'required|date',
        ]);

        // Generate password: firstname.MMDD (use date_hired for employees)
        $dateHired = \Carbon\Carbon::parse($validated['date_hired']);
        $password = strtolower($validated['first_name']) . '.' . $dateHired->format('md');

        $employee = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($password),
            'phone' => $validated['phone'] ?? null,
            'role' => 'Employee',
            'status' => 'Active',
            'position' => $validated['position'],
            'salary' => $validated['salary'],
            'date_hired' => $validated['date_hired'],
        ]);

        return $this->successResponse($employee, 'Employee created successfully', 201);
    }

    public function show(User $employee): JsonResponse
    {
        if (!in_array($employee->role, ['Owner', 'Employee'])) {
            return $this->errorResponse('Employee not found', 404);
        }

        return $this->successResponse($employee);
    }

    public function update(Request $request, User $employee): JsonResponse
    {
        if (!in_array($employee->role, ['Owner', 'Employee'])) {
            return $this->errorResponse('Employee not found', 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $employee->id,
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:Active,Inactive',
            'position' => 'sometimes|in:Trainer,Receptionist,Manager,Maintenance',
            'salary' => 'sometimes|numeric|min:0',
            'date_hired' => 'sometimes|date',
        ]);

        if (isset($validated['first_name']) || isset($validated['last_name'])) {
            $validated['name'] = ($validated['first_name'] ?? $employee->first_name) 
                . ' ' . ($validated['last_name'] ?? $employee->last_name);
        }

        $employee->update($validated);

        return $this->successResponse($employee, 'Employee updated successfully');
    }

    public function destroy(User $employee): JsonResponse
    {
        if ($employee->role === 'Owner') {
            return $this->errorResponse('Cannot delete Owner account', 400);
        }

        if ($employee->role !== 'Employee') {
            return $this->errorResponse('Employee not found', 404);
        }

        // Check if employee has payroll history
        if ($employee->payrolls()->exists()) {
            return $this->errorResponse('Cannot delete employee with payroll history', 400);
        }

        $employee->delete();

        return $this->successResponse(null, 'Employee deleted successfully');
    }

    public function active(): JsonResponse
    {
        $employees = User::whereIn('role', ['Owner', 'Employee'])
            ->where('status', 'Active')
            ->get();

        return $this->successResponse($employees);
    }
}