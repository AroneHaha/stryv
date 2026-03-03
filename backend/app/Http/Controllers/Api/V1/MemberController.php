<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MemberResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    /**
     * List members
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::where('role', 'Member');

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

        // Filter plan
        if ($request->plan && $request->plan !== 'All') {
            $query->where('plan', $request->plan);
        }

        $members = $query->orderBy('created_at', 'desc')->paginate($request->per_page ?? 15);

        return $this->paginatedResponse($members, MemberResource::class);
    }

    /**
     * Create member
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string',
            'plan' => 'required|in:6 Months,1 Year',
            'customerType' => 'required|in:Regular,Student',
            'paymentMethod' => 'required|in:Cash,GCash',
            'startDate' => 'required|date',
        ]);

        $price = $this->calculatePrice($request->plan, $request->customerType);
        $expirationDate = $this->calculateExpiration($request->startDate, $request->plan);
        $username = $this->generateUsername($request->firstName, $request->lastName);
        $password = $this->generatePassword($request->lastName, $request->startDate);

        $member = User::create([
            'first_name' => $request->firstName,
            'last_name' => $request->lastName,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => 'Member',
            'plan' => $request->plan,
            'customer_type' => $request->customerType,
            'payment_method' => $request->paymentMethod,
            'membership_price' => $price,
            'start_date' => $request->startDate,
            'expiration_date' => $expirationDate,
            'username' => $username,
            'password' => Hash::make($password),
            'status' => 'Active',
        ]);

        return $this->successResponse([
            'member' => $this->formatMember($member),
            'credentials' => [
                'username' => $username,
                'password' => $password,
            ],
        ], 'Member created', 201);
    }

    /**
     * Get member
     */
    public function show($id): JsonResponse
    {
        $member = User::where('role', 'Member')->find($id);
        
        if (!$member) {
            return $this->errorResponse('Member not found', 404);
        }

        return $this->successResponse(['member' => $this->formatMember($member)]);
    }

    /**
     * Update member
     */
    public function update(Request $request, $id): JsonResponse
    {
        $member = User::where('role', 'Member')->find($id);
        
        if (!$member) {
            return $this->errorResponse('Member not found', 404);
        }

        $request->validate([
            'firstName' => 'sometimes|string',
            'lastName' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'nullable|string',
        ]);

        $member->update([
            'first_name' => $request->firstName ?? $member->first_name,
            'last_name' => $request->lastName ?? $member->last_name,
            'email' => $request->email ?? $member->email,
            'phone' => $request->phone ?? $member->phone,
        ]);

        return $this->successResponse(['member' => $this->formatMember($member->fresh())]);
    }

    /**
     * Delete member
     */
    public function destroy($id): JsonResponse
    {
        $member = User::where('role', 'Member')->find($id);
        
        if (!$member) {
            return $this->errorResponse('Member not found', 404);
        }

        $member->delete();
        return $this->successResponse(null, 'Member deleted');
    }

    /**
     * Renew membership
     */
    public function renew(Request $request, $id): JsonResponse
    {
        $member = User::where('role', 'Member')->find($id);
        
        if (!$member) {
            return $this->errorResponse('Member not found', 404);
        }

        $request->validate([
            'plan' => 'required|in:6 Months,1 Year',
            'customerType' => 'required|in:Regular,Student',
            'paymentMethod' => 'required|in:Cash,GCash',
            'startDate' => 'required|date',
        ]);

        $price = $this->calculatePrice($request->plan, $request->customerType);
        $expirationDate = $this->calculateExpiration($request->startDate, $request->plan);

        $member->update([
            'plan' => $request->plan,
            'customer_type' => $request->customerType,
            'payment_method' => $request->paymentMethod,
            'membership_price' => $price,
            'start_date' => $request->startDate,
            'expiration_date' => $expirationDate,
            'status' => 'Active',
        ]);

        return $this->successResponse(['member' => $this->formatMember($member->fresh())]);
    }

    /**
     * Toggle status
     */
    public function toggleStatus($id): JsonResponse
    {
        $member = User::where('role', 'Member')->find($id);
        
        if (!$member) {
            return $this->errorResponse('Member not found', 404);
        }

        $newStatus = $member->status === 'Active' ? 'Inactive' : 'Active';
        $member->update(['status' => $newStatus]);

        return $this->successResponse(['member' => $this->formatMember($member->fresh())]);
    }

    /**
     * Format member for response (camelCase for frontend)
     */
    private function formatMember(User $member): array
    {
        return [
            'id' => $member->id,
            'firstName' => $member->first_name,
            'lastName' => $member->last_name,
            'name' => $member->name,
            'email' => $member->email,
            'phone' => $member->phone,
            'customerType' => $member->customer_type,
            'plan' => $member->plan,
            'paymentMethod' => $member->payment_method,
            'price' => (float) $member->membership_price,
            'startDate' => $member->start_date?->format('Y-m-d'),
            'expirationDate' => $member->expiration_date?->format('Y-m-d'),
            'username' => $member->username,
            'status' => $member->status,
        ];
    }

    private function calculatePrice(string $plan, string $type): float
    {
        $prices = [
            '6 Months' => ['Regular' => 1000, 'Student' => 800],
            '1 Year' => ['Regular' => 2000, 'Student' => 1600],
        ];
        return $prices[$plan][$type] ?? 0;
    }

    private function calculateExpiration(string $startDate, string $plan): string
    {
        $months = $plan === '6 Months' ? 6 : 12;
        return date('Y-m-d', strtotime($startDate . " +{$months} months"));
    }

    private function generateUsername(string $firstName, string $lastName): string
    {
        $base = Str::lower($firstName . '.' . $lastName);
        $username = $base;
        $count = 1;

        while (User::where('username', $username)->exists()) {
            $username = $base . $count++;
        }

        return $username;
    }

    private function generatePassword(string $lastName, string $startDate): string
    {
        $date = date('md', strtotime($startDate));
        return Str::lower($lastName) . '.' . $date;
    }
}