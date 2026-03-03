<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'customer_type' => $this->customer_type,
            'plan' => $this->plan,
            'payment_method' => $this->payment_method,
            'membership_price' => $this->membership_price,
            'start_date' => $this->start_date?->toDateString(),
            'expiration_date' => $this->expiration_date?->toDateString(),
            'username' => $this->username,
            'status' => $this->status,
            'membership_status' => $this->membership_status,
            'days_until_expiration' => $this->days_until_expiration,
            'is_expired' => $this->isExpired(),
            'is_expiring_soon' => $this->isExpiringSoon(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
