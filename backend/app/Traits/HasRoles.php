<?php

namespace App\Traits;

trait HasRoles
{
    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles.
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Check if user is an admin (Owner or Employee).
     */
    public function isAdmin(): bool
    {
        return in_array($this->role, ['Owner', 'Employee']);
    }

    /**
     * Check if user is the owner.
     */
    public function isOwner(): bool
    {
        return $this->role === 'Owner';
    }

    /**
     * Check if user is an employee.
     */
    public function isEmployee(): bool
    {
        return $this->role === 'Employee';
    }

    /**
     * Check if user is a member.
     */
    public function isMember(): bool
    {
        return $this->role === 'Member';
    }

    /**
     * Scope query to users with specific role.
     */
    public function scopeWithRole($query, string $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Scope query to admin users (Owner or Employee).
     */
    public function scopeAdmins($query)
    {
        return $query->whereIn('role', ['Owner', 'Employee']);
    }
}