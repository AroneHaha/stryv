<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if ($request->user()->role !== 'Owner') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only Owner can access this resource',
                ], 403);
            }
            return $next($request);
        });
    }

    public function index(Request $request)
    {
        $query = User::whereIn('role', ['Owner', 'Employee'])
            ->with('employee')
            ->orderBy('created_at', 'desc');

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $employees = $query->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'data' => $employees,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'position' => 'required|string|max:255',
            'salary' => 'required|numeric|min:0',
            'date_hired' => 'required|date',
            'role' => 'sometimes|in:Employee',
        ]);

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make('password'),
            'role' => 'Employee',
            'status' => 'Active',
        ]);

        $employee = Employee::create([
            'user_id' => $user->id,
            'position' => $validated['position'],
            'salary' => $validated['salary'],
            'date_hired' => $validated['date_hired'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            'data' => $user->load('employee'),
        ], 201);
    }

    public function show($id)
    {
        $employee = User::whereIn('role', ['Owner', 'Employee'])
            ->with('employee')
            ->find($id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::whereIn('role', ['Owner', 'Employee'])->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found',
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:Active,Inactive',
            'position' => 'sometimes|string|max:255',
            'salary' => 'sometimes|numeric|min:0',
        ]);

        $user->update([
            'first_name' => $validated['first_name'] ?? $user->first_name,
            'last_name' => $validated['last_name'] ?? $user->last_name,
            'name' => ($validated['first_name'] ?? $user->first_name) . ' ' . 
                      ($validated['last_name'] ?? $user->last_name),
            'email' => $validated['email'] ?? $user->email,
            'phone' => $validated['phone'] ?? $user->phone,
            'status' => $validated['status'] ?? $user->status,
        ]);

        if ($user->employee) {
            $user->employee->update([
                'position' => $validated['position'] ?? $user->employee->position,
                'salary' => $validated['salary'] ?? $user->employee->salary,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully',
            'data' => $user->load('employee'),
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('role', 'Employee')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found or cannot be deleted',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully',
        ]);
    }

    public function active()
    {
        $employees = User::whereIn('role', ['Owner', 'Employee'])
            ->where('status', 'Active')
            ->with('employee')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $employees,
        ]);
    }
}