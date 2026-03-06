<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    public function __construct()
    {
        // Only Owner and Employee can access
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
        $query = User::where('role', 'Member')
            ->with('member')
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

        $members = $query->paginate($request->per_page ?? 10);

        return response()->json([
            'success' => true,
            'data' => $members,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'customer_type' => 'required|in:Regular,Student',
            'plan' => 'required|in:6 Months,1 Year',
            'payment_method' => 'required|in:Cash,GCash',
            'membership_price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        $expirationDate = match ($validated['plan']) {
            '6 Months' => now()->parse($validated['start_date'])->addMonths(6),
            '1 Year' => now()->parse($validated['start_date'])->addYear(),
        };

        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make('password'),
            'role' => 'Member',
            'status' => 'Active',
        ]);

        $member = Member::create([
            'user_id' => $user->id,
            'customer_type' => $validated['customer_type'],
            'plan' => $validated['plan'],
            'payment_method' => $validated['payment_method'],
            'membership_price' => $validated['membership_price'],
            'start_date' => $validated['start_date'],
            'expiration_date' => $expirationDate,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Member created successfully',
            'data' => $user->load('member'),
        ], 201);
    }

    public function show($id)
    {
        $member = User::where('role', 'Member')
            ->with('member')
            ->find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $member,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('role', 'Member')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found',
            ], 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'status' => 'sometimes|in:Active,Inactive',
            'customer_type' => 'sometimes|in:Regular,Student',
            'plan' => 'sometimes|in:6 Months,1 Year',
            'payment_method' => 'sometimes|in:Cash,GCash',
            'membership_price' => 'sometimes|numeric|min:0',
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

        if ($user->member && isset($validated['plan'])) {
            $expirationDate = match ($validated['plan']) {
                '6 Months' => now()->addMonths(6),
                '1 Year' => now()->addYear(),
            };

            $user->member->update([
                'customer_type' => $validated['customer_type'] ?? $user->member->customer_type,
                'plan' => $validated['plan'] ?? $user->member->plan,
                'payment_method' => $validated['payment_method'] ?? $user->member->payment_method,
                'membership_price' => $validated['membership_price'] ?? $user->member->membership_price,
                'expiration_date' => $expirationDate,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Member updated successfully',
            'data' => $user->load('member'),
        ]);
    }

    public function destroy($id)
    {
        $user = User::where('role', 'Member')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Member deleted successfully',
        ]);
    }

    public function renew(Request $request, $id)
    {
        $user = User::where('role', 'Member')->with('member')->find($id);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Member not found',
            ], 404);
        }

        $validated = $request->validate([
            'plan' => 'required|in:6 Months,1 Year',
            'payment_method' => 'required|in:Cash,GCash',
            'membership_price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        $expirationDate = match ($validated['plan']) {
            '6 Months' => now()->parse($validated['start_date'])->addMonths(6),
            '1 Year' => now()->parse($validated['start_date'])->addYear(),
        };

        $user->member->update([
            'plan' => $validated['plan'],
            'payment_method' => $validated['payment_method'],
            'membership_price' => $validated['membership_price'],
            'start_date' => $validated['start_date'],
            'expiration_date' => $expirationDate,
        ]);

        $user->update(['status' => 'Active']);

        return response()->json([
            'success' => true,
            'message' => 'Membership renewed successfully',
            'data' => $user->load('member'),
        ]);
    }
}