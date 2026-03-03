<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class EmployeeRequest extends FormRequest
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
        $employeeId = $this->route('employee')?->id ?? null;

        $rules = [
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($employeeId)->whereNull('deleted_at'),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'position' => ['required', 'in:Trainer,Receptionist,Manager,Maintenance'],
            'salary' => ['required', 'numeric', 'min:0'],
            'date_hired' => ['required', 'date'],
        ];

        // Password is required on create, optional on update
        if ($this->isMethod('POST')) {
            $rules['password'] = ['required', 'string', 'min:6'];
        } else {
            $rules['password'] = ['sometimes', 'nullable', 'string', 'min:6'];
        }

        // For update, make some fields optional
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules['position'] = ['sometimes', 'in:Trainer,Receptionist,Manager,Maintenance'];
            $rules['salary'] = ['sometimes', 'numeric', 'min:0'];
            $rules['date_hired'] = ['sometimes', 'date'];
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
            'position.required' => 'Please select a position.',
            'position.in' => 'Invalid position selected.',
            'salary.required' => 'Salary is required.',
            'salary.numeric' => 'Salary must be a number.',
            'salary.min' => 'Salary cannot be negative.',
            'date_hired.required' => 'Date hired is required.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 6 characters.',
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