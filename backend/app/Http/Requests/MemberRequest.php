<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class MemberRequest extends FormRequest
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
        $memberId = $this->route('member')?->id ?? null;

        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($memberId)->whereNull('deleted_at'),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'plan' => ['required', 'in:6 Months,1 Year'],
            'customer_type' => ['required', 'in:Regular,Student'],
            'payment_method' => ['required', 'in:Cash,GCash'],
            'start_date' => ['required', 'date'],
        ];

        // For update, make some fields optional
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['plan'] = ['sometimes', 'in:6 Months,1 Year'];
            $rules['customer_type'] = ['sometimes', 'in:Regular,Student'];
            $rules['payment_method'] = ['sometimes', 'in:Cash,GCash'];
            $rules['start_date'] = ['sometimes', 'date'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'first_name.required' => 'First name is required.',
            'last_name.required' => 'Last name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken.',
            'plan.required' => 'Please select a membership plan.',
            'plan.in' => 'Invalid plan selected.',
            'customer_type.required' => 'Please select a customer type.',
            'payment_method.required' => 'Please select a payment method.',
            'start_date.required' => 'Start date is required.',
        ];
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