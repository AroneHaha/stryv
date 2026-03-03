<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'member_id' => $this->member_id,
            'name' => $this->name,
            'type' => $this->type,
            'customer_type' => $this->customer_type,
            'payment_method' => $this->payment_method,
            'price' => (float) $this->price,
            'date' => $this->date?->toDateString(),
            'time' => $this->time,
            'formatted_time' => $this->formatted_time,
            'recorded_by' => $this->recorded_by,
            'recorder' => new UserResource($this->whenLoaded('recorder')),
            'member' => new MemberResource($this->whenLoaded('member')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}