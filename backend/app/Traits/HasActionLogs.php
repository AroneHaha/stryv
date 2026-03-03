<?php

namespace App\Traits;

use App\Models\ActionLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

trait HasActionLogs
{
    /**
     * Log an action for this model.
     */
    public function logAction(
        string $action,
        ?array $oldData = null,
        ?array $newData = null,
        ?string $description = null
    ): ActionLog {
        return ActionLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => get_class($this),
            'model_id' => $this->id,
            'description' => $description,
            'old_data' => $oldData,
            'new_data' => $newData,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get all action logs for this model.
     */
    public function actionLogs()
    {
        return ActionLog::where('model_type', get_class($this))
            ->where('model_id', $this->id)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Boot the trait.
     */
    protected static function bootHasActionLogs()
    {
        // Log on create
        static::created(function (Model $model) {
            if (Auth::check()) {
                $model->logAction(
                    'create_' . strtolower(class_basename($model)),
                    null,
                    $model->toArray(),
                    'Created ' . class_basename($model)
                );
            }
        });

        // Log on update
        static::updated(function (Model $model) {
            if (Auth::check()) {
                $changes = $model->getChanges();
                unset($changes['updated_at']);

                if (!empty($changes)) {
                    $model->logAction(
                        'update_' . strtolower(class_basename($model)),
                        array_intersect_key($model->getOriginal(), $changes),
                        $changes,
                        'Updated ' . class_basename($model)
                    );
                }
            }
        });

        // Log on delete
        static::deleted(function (Model $model) {
            if (Auth::check()) {
                $model->logAction(
                    'delete_' . strtolower(class_basename($model)),
                    $model->toArray(),
                    null,
                    'Deleted ' . class_basename($model)
                );
            }
        });
    }
}