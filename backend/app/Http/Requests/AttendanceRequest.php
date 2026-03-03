<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class AttendanceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'member_id' => ['nullable', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:Member,Walk-in,Expired'],
            'customer_type' => ['required', 'in:Regular,Student'],
            'payment_method' => ['required', 'in:Cash,GCash'],
            'price' => ['required', 'numeric', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Name is required.',
            'type.required' => 'Type is required.',
            'type.in' => 'Invalid type selected.',
            'customer_type.required' => 'Customer type is required.',
            'customer_type.in' => 'Invalid customer type.',
            'payment_method.required' => 'Payment method is required.',
            'payment_method.in' => 'Invalid payment method.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price cannot be negative.',
            'member_id.exists' => 'Selected member does not exist.',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Check for duplicate attendance today for members
            if ($this->member_id && $this->type === 'Member') {
                $exists = \App\Models\Attendance::where('member_id', $this->member_id)
                    ->where('date', today())
                    ->exists();

                if ($exists) {
                    $validator->errors()->add('member_id', 'This member already has an attendance record for today.');
                }
            }
        });
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}