<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'Member')
            ->orderBy('created_at', 'desc');

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $members = $query->paginate($request->per_page ?? 15);

        return $this->successResponse($members);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'birthdate' => 'required|date',
            'customer_type' => 'required|in:Regular,Student',
            'plan' => 'required|in:6 Months,1 Year',
            'payment_method' => 'required|in:Cash,GCash',
            'membership_price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        // Generate username: firstname.surname
        $username = strtolower(str_replace(' ', '', $validated['first_name'] . '.' . $validated['last_name']));
        
        // Check for duplicate username
        $existingUsername = User::where('username', $username)->first();
        if ($existingUsername) {
            $username = $username . '.' . time();
        }

        // Generate password: surname.MMDD
        $birthdate = \Carbon\Carbon::parse($validated['birthdate']);
        $password = strtolower($validated['last_name']) . '.' . $birthdate->format('md');

        // Calculate expiration date based on plan
        $startDate = \Carbon\Carbon::parse($validated['start_date']);
        $expirationDate = $validated['plan'] === '1 Year' 
            ? $startDate->addYear() 
            : $startDate->addMonths(6);

        $member = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => bcrypt($password),
            'phone' => $validated['phone'] ?? null,
            'role' => 'Member',
            'status' => 'Active',
            'birthdate' => $validated['birthdate'],
            'username' => $username,
            'customer_type' => $validated['customer_type'],
            'plan' => $validated['plan'],
            'payment_method' => $validated['payment_method'],
            'membership_price' => $validated['membership_price'],
            'start_date' => $validated['start_date'],
            'expiration_date' => $expirationDate,
        ]);

        return $this->successResponse($member, 'Member created successfully', 201);
    }

    public function show(User $member): JsonResponse
    {
        if ($member->role !== 'Member') {
            return $this->errorResponse('Member not found', 404);
        }

        return $this->successResponse($member->load('attendances'));
    }

    public function update(Request $request, User $member): JsonResponse
    {
        if ($member->role !== 'Member') {
            return $this->errorResponse('Member not found', 404);
        }

        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $member->id,
            'phone' => 'nullable|string|max:20',
            'birthdate' => 'sometimes|date',
            'customer_type' => 'sometimes|in:Regular,Student',
            'plan' => 'sometimes|in:6 Months,1 Year',
            'payment_method' => 'sometimes|in:Cash,GCash',
            'membership_price' => 'sometimes|numeric|min:0',
            'start_date' => 'sometimes|date',
        ]);

        if (isset($validated['first_name']) || isset($validated['last_name'])) {
            $validated['name'] = ($validated['first_name'] ?? $member->first_name) 
                . ' ' . ($validated['last_name'] ?? $member->last_name);
        }

        // Recalculate expiration if plan or start_date changed
        if (isset($validated['plan']) || isset($validated['start_date'])) {
            $plan = $validated['plan'] ?? $member->plan;
            $startDate = \Carbon\Carbon::parse($validated['start_date'] ?? $member->start_date);
            $validated['expiration_date'] = $plan === '1 Year' 
                ? $startDate->addYear() 
                : $startDate->addMonths(6);
        }

        $member->update($validated);

        return $this->successResponse($member, 'Member updated successfully');
    }

    public function destroy(User $member): JsonResponse
    {
        if ($member->role !== 'Member') {
            return $this->errorResponse('Member not found', 404);
        }

        $member->delete();

        return $this->successResponse(null, 'Member deleted successfully');
    }

    public function renew(Request $request, User $member): JsonResponse
    {
        if ($member->role !== 'Member') {
            return $this->errorResponse('Member not found', 404);
        }

        $validated = $request->validate([
            'plan' => 'required|in:6 Months,1 Year',
            'payment_method' => 'required|in:Cash,GCash',
            'membership_price' => 'required|numeric|min:0',
        ]);

        // Start from expiration date if not expired, else from today
        $startDate = $member->expiration_date > now() 
            ? $member->expiration_date 
            : now();

        $expirationDate = $validated['plan'] === '1 Year' 
            ? \Carbon\Carbon::parse($startDate)->addYear() 
            : \Carbon\Carbon::parse($startDate)->addMonths(6);

        $member->update([
            'plan' => $validated['plan'],
            'payment_method' => $validated['payment_method'],
            'membership_price' => $validated['membership_price'],
            'start_date' => $startDate,
            'expiration_date' => $expirationDate,
            'status' => 'Active',
        ]);

        return $this->successResponse($member, 'Membership renewed successfully');
    }
}