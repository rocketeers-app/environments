<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => [
                'message' => 'The design system is the product.',
                'author' => 'Rocketeers',
            ],
            'auth' => [
                'user' => $request->user(),
                'userRoles' => ['owner'],
                'teams' => [],
                'currentTeam' => null,
                'can' => [
                    'settings' => true,
                    'members' => true,
                    'providers' => true,
                    'notificationChannels' => true,
                    'billing' => true,
                    'ai' => true,
                ],
            ],
            'formatting' => [
                'timezone' => 'Europe/Amsterdam',
                'locale' => 'en-GB',
            ],
            'currentProject' => null,
            'projects' => null,
            'hasClients' => false,
            'sidebarOpen' => $request->cookie('sidebar_state') !== 'false',
            'notificationCount' => 0,
            'notifications' => [],
        ];
    }

    public function rootView(Request $request): string
    {
        return $this->rootView;
    }
}
