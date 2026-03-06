<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create Owner
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'Owner',
            'name' => 'Admin Owner',
            'email' => 'admin@stryv.com',
            'password' => bcrypt('password'),
            'phone' => '09123456789',
            'role' => 'Owner',
            'status' => 'Active',
        ]);

        // Create Employees
        $employees = [
            [
                'first_name' => 'Carlos',
                'last_name' => 'Santos',
                'name' => 'Carlos Santos',
                'email' => 'carlos@stryv.com',
                'phone' => '09123456790',
                'position' => 'Trainer',
                'salary' => 15000,
                'date_hired' => '2024-01-15',
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Reyes',
                'name' => 'Maria Reyes',
                'email' => 'maria@stryv.com',
                'phone' => '09123456791',
                'position' => 'Receptionist',
                'salary' => 12000,
                'date_hired' => '2024-02-01',
            ],
            [
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@stryv.com',
                'phone' => '09123456792',
                'position' => 'Manager',
                'salary' => 18000,
                'date_hired' => '2023-06-01',
            ],
            [
                'first_name' => 'Pedro',
                'last_name' => 'Garcia',
                'name' => 'Pedro Garcia',
                'email' => 'pedro@stryv.com',
                'phone' => '09123456793',
                'position' => 'Maintenance',
                'salary' => 10000,
                'date_hired' => '2024-03-01',
            ],
        ];

        foreach ($employees as $employee) {
            User::create([
                'first_name' => $employee['first_name'],
                'last_name' => $employee['last_name'],
                'name' => $employee['name'],
                'email' => $employee['email'],
                'password' => bcrypt('password'),
                'phone' => $employee['phone'],
                'role' => 'Employee',
                'status' => 'Active',
                'position' => $employee['position'],
                'salary' => $employee['salary'],
                'date_hired' => $employee['date_hired'],
            ]);
        }

        // Create Members
        $members = [
            [
                'first_name' => 'Mark',
                'last_name' => 'Delacruz',
                'email' => 'mark@gmail.com',
                'phone' => '09181112222',
                'birthdate' => '1995-06-15',
                'customer_type' => 'Regular',
                'plan' => '1 Year',
                'payment_method' => 'GCash',
                'membership_price' => 2000,
                'start_date' => '2026-01-01',
                'expiration_date' => '2027-01-01',
            ],
            [
                'first_name' => 'Anna',
                'last_name' => 'Santos',
                'email' => 'anna@gmail.com',
                'phone' => '09182223333',
                'birthdate' => '2000-03-20',
                'customer_type' => 'Student',
                'plan' => '6 Months',
                'payment_method' => 'Cash',
                'membership_price' => 800,
                'start_date' => '2026-02-01',
                'expiration_date' => '2026-08-01',
            ],
            [
                'first_name' => 'Jose',
                'last_name' => 'Reyes',
                'email' => 'jose@gmail.com',
                'phone' => '09183334444',
                'birthdate' => '1988-11-10',
                'customer_type' => 'Regular',
                'plan' => '6 Months',
                'payment_method' => 'GCash',
                'membership_price' => 1000,
                'start_date' => '2025-09-01',
                'expiration_date' => '2026-03-01',
            ],
            [
                'first_name' => 'Lisa',
                'last_name' => 'Garcia',
                'email' => 'lisa@gmail.com',
                'phone' => '09184445555',
                'birthdate' => '1992-07-25',
                'customer_type' => 'Student',
                'plan' => '1 Year',
                'payment_method' => 'Cash',
                'membership_price' => 1600,
                'start_date' => '2026-01-15',
                'expiration_date' => '2027-01-15',
            ],
            [
                'first_name' => 'Miguel',
                'last_name' => 'Torres',
                'email' => 'miguel@gmail.com',
                'phone' => '09185556666',
                'birthdate' => '1990-04-05',
                'customer_type' => 'Regular',
                'plan' => '1 Year',
                'payment_method' => 'GCash',
                'membership_price' => 2000,
                'start_date' => '2025-12-01',
                'expiration_date' => '2026-12-01',
            ],
        ];

        foreach ($members as $member) {
            // Generate username: firstname.surname (lowercase, no spaces)
            $username = strtolower(str_replace(' ', '', $member['first_name'] . '.' . $member['last_name']));
            
            // Generate password: surname.MMDD (from birthdate)
            $birthdate = \Carbon\Carbon::parse($member['birthdate']);
            $password = strtolower($member['last_name']) . '.' . $birthdate->format('md');
            
            User::create([
                'first_name' => $member['first_name'],
                'last_name' => $member['last_name'],
                'name' => $member['first_name'] . ' ' . $member['last_name'],
                'email' => $member['email'],
                'password' => bcrypt($password),
                'phone' => $member['phone'],
                'role' => 'Member',
                'status' => 'Active',
                'birthdate' => $member['birthdate'],
                'username' => $username,
                'customer_type' => $member['customer_type'],
                'plan' => $member['plan'],
                'payment_method' => $member['payment_method'],
                'membership_price' => $member['membership_price'],
                'start_date' => $member['start_date'],
                'expiration_date' => $member['expiration_date'],
            ]);
        }

        // Create sample attendance records
        $memberIds = User::where('role', 'Member')->pluck('id');
        $employeeIds = User::whereIn('role', ['Owner', 'Employee'])->pluck('id');
        
        for ($i = 0; $i < 10; $i++) {
            $memberId = $memberIds->random();
            $member = User::find($memberId);
            
            Attendance::create([
                'member_id' => $memberId,
                'name' => $member->name,
                'type' => 'Member',
                'customer_type' => $member->customer_type,
                'payment_method' => rand(0, 1) ? 'Cash' : 'GCash',
                'price' => $member->customer_type === 'Regular' ? 160 : 128,
                'date' => now()->subDays(rand(0, 30))->format('Y-m-d'),
                'time' => sprintf('%02d:%02d:00', rand(6, 20), rand(0, 59)),
                'recorded_by' => $employeeIds->random(),
            ]);
        }

        // Create sample payroll records
        foreach ($employeeIds as $employeeId) {
            $employee = User::find($employeeId);
            if ($employee->salary) {
                Payroll::create([
                    'employee_id' => $employeeId,
                    'employee_name' => $employee->name,
                    'salary' => $employee->salary,
                    'month' => 2,
                    'year' => 2026,
                    'status' => rand(0, 1) ? 'Paid' : 'Unpaid',
                ]);
            }
        }
    }
}