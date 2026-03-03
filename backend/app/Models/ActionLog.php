<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ActionLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'action',
        'model_type',
        'model_id',
        'description',
        'old_data',
        'new_data',
        'ip_address',
        'user_agent',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'old_data' => 'array',
        'new_data' => 'array',
    ];

    // ==================== RELATIONSHIPS ====================

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ==================== SCOPES ====================

    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByModel($query, string $modelType, ?int $modelId = null)
    {
        $query->where('model_type', $modelType);
        if ($modelId) {
            $query->where('model_id', $modelId);
        }
        return $query;
    }

    public function scopeRecent($query, int $limit = 50)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }

    // ==================== STATIC HELPERS ====================

    /**
     * Log an action
     */
    public static function log(
        string $action,
        ?Model $model = null,
        ?array $oldData = null,
        ?array $newData = null,
        ?string $description = null
    ): self {
        return self::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'action' => $action,
            'model_type' => $model ? get_class($model) : null,
            'model_id' => $model?->id,
            'description' => $description,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }

    /**
     * Common action types
     */
    public const ACTION_LOGIN = 'login';
    public const ACTION_LOGOUT = 'logout';
    public const ACTION_ADD_MEMBER = 'add_member';
    public const ACTION_EDIT_MEMBER = 'edit_member';
    public const ACTION_DELETE_MEMBER = 'delete_member';
    public const ACTION_RENEW_MEMBER = 'renew_member';
    public const ACTION_ADD_EMPLOYEE = 'add_employee';
    public const ACTION_EDIT_EMPLOYEE = 'edit_employee';
    public const ACTION_DELETE_EMPLOYEE = 'delete_employee';
    public const ACTION_RECORD_ATTENDANCE = 'record_attendance';
    public const ACTION_MARK_PAID = 'mark_paid';
    public const ACTION_CHANGE_STATUS = 'change_status';
}