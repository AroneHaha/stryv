<?php

namespace App\Http\Middleware;

use App\Models\ActionLog;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class LogActions
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    /**
     * Handle tasks after the response has been sent to the browser.
     */
    public function terminate(Request $request, Response $response): void
    {
        // Only log authenticated users
        if (!Auth::check()) {
            return;
        }

        // Only log successful mutations (POST, PUT, PATCH, DELETE)
        $method = $request->method();
        if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return;
        }

        if ($response->getStatusCode() >= 400) {
            return;
        }

        // Determine action based on route and method
        $action = $this->determineAction($request);

        if (!$action) {
            return;
        }

        // Log the action
        ActionLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model_type' => null,
            'model_id' => null,
            'description' => "{$action} on {$request->path()}",
            'old_data' => null,
            'new_data' => $request->except(['password', 'password_confirmation']),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    /**
     * Determine the action name based on route and method.
     */
    private function determineAction(Request $request): ?string
    {
        $route = $request->route()?->getName() ?? '';
        $method = $request->method();

        // Map routes to actions
        $actionMap = [
            'login' => ActionLog::ACTION_LOGIN,
            'logout' => ActionLog::ACTION_LOGOUT,
            'members.store' => ActionLog::ACTION_ADD_MEMBER,
            'members.update' => ActionLog::ACTION_EDIT_MEMBER,
            'members.destroy' => ActionLog::ACTION_DELETE_MEMBER,
            'employees.store' => ActionLog::ACTION_ADD_EMPLOYEE,
            'employees.update' => ActionLog::ACTION_EDIT_EMPLOYEE,
            'employees.destroy' => ActionLog::ACTION_DELETE_EMPLOYEE,
            'attendance.store' => ActionLog::ACTION_RECORD_ATTENDANCE,
            'payroll.mark-paid' => ActionLog::ACTION_MARK_PAID,
        ];

        return $actionMap[$route] ?? null;
    }
}