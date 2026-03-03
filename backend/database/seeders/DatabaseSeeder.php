<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Attendance;
use App\Models\Payroll;
use App\Models\Membership;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::create([
            'first_name' => 'Admin',
            'last_name' => 'Owner',
            'name' => 'Admin Owner',
            'email' => 'admin@stryv.com',
            'password' => Hash::make('password'),
            'phone' => '09171234567',
            'role' => 'Owner',
            'status' => 'Active',
        ]);

        $employees = [
            ['first_name' => 'Carlos', 'last_name' => 'Santos', 'email' => 'carlos@stryv.com', 'phone' => '09171111111', 'position' => 'Trainer', 'salary' => 18000, 'date_hired' => now()->subMonths(6)],
            ['first_name' => 'Maria', 'last_name' => 'Reyes', 'email' => 'maria@stryv.com', 'phone' => '09172222222', 'position' => 'Trainer', 'salary' => 16000, 'date_hired' => now()->subMonths(4)],
            ['first_name' => 'Jose', 'last_name' => 'Cruz', 'email' => 'jose@stryv.com', 'phone' => '09173333333', 'position' => 'Receptionist', 'salary' => 12000, 'date_hired' => now()->subMonths(8)],
            ['first_name' => 'Ana', 'last_name' => 'Garcia', 'email' => 'ana@stryv.com', 'phone' => '09174444444', 'position' => 'Manager', 'salary' => 25000, 'date_hired' => now()->subYears(1)],
            ['first_name' => 'Pedro', 'last_name' => 'Mendoza', 'email' => 'pedro@stryv.com', 'phone' => '09175555555', 'position' => 'Maintenance', 'salary' => 10000, 'date_hired' => now()->subMonths(2)],
        ];

        $createdEmployees = [];
        foreach ($employees as $emp) {
            $createdEmployees[] = User::create([
                'first_name' => $emp['first_name'],
                'last_name' => $emp['last_name'],
                'name' => $emp['first_name'] . ' ' . $emp['last_name'],
                'email' => $emp['email'],
                'password' => Hash::make('password'),
                'phone' => $emp['phone'],
                'role' => 'Employee',
                'position' => $emp['position'],
                'salary' => $emp['salary'],
                'date_hired' => $emp['date_hired'],
                'status' => 'Active',
            ]);
        }

        $members = [
            ['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'email' => 'juan@gmail.com', 'phone' => '09181111111', 'username' => 'juan.delacruz', 'customer_type' => 'Regular', 'plan' => '1 Year', 'payment_method' => 'Cash', 'membership_price' => 2000, 'start_date' => now()->subMonths(3), 'expiration_date' => now()->addMonths(9), 'status' => 'Active'],
            ['first_name' => 'Maria', 'last_name' => 'Santos', 'email' => 'maria.santos@gmail.com', 'phone' => '09182222222', 'username' => 'maria.santos', 'customer_type' => 'Student', 'plan' => '6 Months', 'payment_method' => 'GCash', 'membership_price' => 1000, 'start_date' => now()->subMonth(), 'expiration_date' => now()->addMonths(5), 'status' => 'Active'],
            ['first_name' => 'Luis', 'last_name' => 'Garcia', 'email' => 'luis.garcia@gmail.com', 'phone' => '09183333333', 'username' => 'luis.garcia', 'customer_type' => 'Regular', 'plan' => '1 Year', 'payment_method' => 'Cash', 'membership_price' => 2000, 'start_date' => now()->subWeek(), 'expiration_date' => now()->addMonths(12), 'status' => 'Active'],
            ['first_name' => 'Sofia', 'last_name' => 'Reyes', 'email' => 'sofia.reyes@gmail.com', 'phone' => '09184444444', 'username' => 'sofia.reyes', 'customer_type' => 'Student', 'plan' => '6 Months', 'payment_method' => 'GCash', 'membership_price' => 1000, 'start_date' => now()->subMonths(2), 'expiration_date' => now()->addMonths(4), 'status' => 'Active'],
            ['first_name' => 'Diego', 'last_name' => 'Torres', 'email' => 'diego.torres@gmail.com', 'phone' => '09185555555', 'username' => 'diego.torres', 'customer_type' => 'Regular', 'plan' => '1 Year', 'payment_method' => 'Cash', 'membership_price' => 2000, 'start_date' => now()->subMonths(5), 'expiration_date' => now()->addMonths(7), 'status' => 'Active'],
            ['first_name' => 'Rico', 'last_name' => 'Mendoza', 'email' => 'rico.mendoza@gmail.com', 'phone' => '09186666666', 'username' => 'rico.mendoza', 'customer_type' => 'Regular', 'plan' => '6 Months', 'payment_method' => 'Cash', 'membership_price' => 1200, 'start_date' => now()->subMonths(8), 'expiration_date' => now()->subMonths(2), 'status' => 'Expired'],
            ['first_name' => 'Elena', 'last_name' => 'Villar', 'email' => 'elena.villar@gmail.com', 'phone' => '09187777777', 'username' => 'elena.villar', 'customer_type' => 'Student', 'plan' => '6 Months', 'payment_method' => 'GCash', 'membership_price' => 1000, 'start_date' => now()->subMonths(7), 'expiration_date' => now()->subMonth(), 'status' => 'Expired'],
            ['first_name' => 'Marco', 'last_name' => 'Aquino', 'email' => 'marco.aquino@gmail.com', 'phone' => '09188888888', 'username' => 'marco.aquino', 'customer_type' => 'Regular', 'plan' => '1 Year', 'payment_method' => 'Cash', 'membership_price' => 2000, 'start_date' => now()->subYear(), 'expiration_date' => now()->addMonths(2), 'status' => 'Inactive'],
        ];

        $createdMembers = [];
        foreach ($members as $member) {
            $createdMembers[] = User::create([
                'first_name' => $member['first_name'],
                'last_name' => $member['last_name'],
                'name' => $member['first_name'] . ' ' . $member['last_name'],
                'email' => $member['email'],
                'password' => Hash::make('password'),
                'phone' => $member['phone'],
                'role' => 'Member',
                'username' => $member['username'],
                'customer_type' => $member['customer_type'],
                'plan' => $member['plan'],
                'payment_method' => $member['payment_method'],
                'membership_price' => $member['membership_price'],
                'start_date' => $member['start_date'],
                'expiration_date' => $member['expiration_date'],
                'status' => $member['status'],
            ]);
        }

        foreach ($createdMembers as $member) {
            $numAttendances = rand(5, 15);
            for ($i = 0; $i < $numAttendances; $i++) {
                $daysAgo = rand(0, 30);
                Attendance::create([
                    'member_id' => $member->id,
                    'name' => $member->name,
                    'type' => 'Member',
                    'customer_type' => $member->customer_type ?? 'Regular',
                    'payment_method' => 'N/A',
                    'price' => 0,
                    'date' => now()->subDays($daysAgo)->toDateString(),
                    'time' => sprintf('%02d:%02d:00', rand(6, 20), rand(0, 59)),
                    'recorded_by' => $owner->id,
                ]);
            }
        }

        foreach ($createdEmployees as $employee) {
            for ($month = 1; $month <= 3; $month++) {
                $payrollMonth = now()->subMonths(3 - $month)->startOfMonth();
                Payroll::create([
                    'employee_id' => $employee->id,
                    'employee_name' => $employee->name,
                    'salary' => $employee->salary,
                    'month' => $payrollMonth->month,
                    'year' => $payrollMonth->year,
                    'status' => $month < 3 ? 'Paid' : 'Unpaid',
                    'paid_at' => $month < 3 ? $payrollMonth->copy()->addDays(5) : null,
                    'marked_by' => $owner->id,
                ]);
            }
        }

        foreach ($createdMembers as $member) {
            if ($member->status === 'Active' || $member->status === 'Expired') {
                Membership::create([
                    'member_id' => $member->id,
                    'plan' => $member->plan,
                    'customer_type' => $member->customer_type,
                    'payment_method' => $member->payment_method,
                    'price' => $member->membership_price,
                    'start_date' => $member->start_date,
                    'expiration_date' => $member->expiration_date,
                    'status' => $member->status,
                    'processed_by' => $owner->id,
                ]);
            }
        }

        $this->command->info('Database seeded successfully!');
    }
}