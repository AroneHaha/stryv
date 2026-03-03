<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PayrollResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'employee_id' => $this->employee_id,
            'employee_name' => $this->employee_name,
            'salary' => (float) $this->salary,
            'month' => $this->month,
            'year' => $this->year,
            'period' => $this->period,
            'status' => $this->status,
            'paid_at' => $this->paid_at?->toISOString(),
            'marked_by' => $this->marked_by,
            'marker' => new UserResource($this->whenLoaded('marker')),
            'employee' => new EmployeeResource($this->whenLoaded('employee')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
