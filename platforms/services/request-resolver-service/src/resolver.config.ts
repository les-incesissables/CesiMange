// request-resolver-service/src/gateway.config.ts

import { IGatewayConfig } from "./interfaces/IGatewayConfig";

export function loadGatewayConfig(): IGatewayConfig
{
    const defaultConfig: IGatewayConfig = {
        port: Number(process.env.GATEWAY_PORT) || 3000,
        services: [
            {
                routeName: 'auth',
                BaseUrl: (process.env.AUTH_SERVICE_URL || 'http://localhost:4001') + '/auth',
                enabled: true,
                publicRoutes: [
                    {
                        path: '/login',
                        methods: ['POST']
                    },
                    {
                        path: '/register',
                        methods: ['POST']
                    },
                    {
                        path: '/refresh-token',
                        methods: ['POST']
                    },
                    {
                        path: '/logout',
                        methods: ['POST']
                    }
                ],
                protectedRoutes: [
                    {
                        path: '/:id',
                        methods: ['DELETE'],
                        ownershipCheck: {
                            paramName: 'id',
                            matchField: 'id'
                        }
                    },
                    {
                        path: '/admin',
                        methods: ['GET'],
                        allowedRoles: ['admin']
                    }
                ]
            },
            {
                routeName: 'user-profiles',
                BaseUrl: (process.env.restaurant_SERVICE_URL || 'http://localhost:4002') + '/user-profiles',
                enabled: true,
                publicRoutes: [
                    {
                        path: '/',
                        methods: ['GET']
                    },
                    {
                        path: '/:id',
                        methods: ['GET']
                    },
                    {
                        path: '/',
                        methods: ['POST']
                    }
                ],
                protectedRoutes: [
                    {
                        path: '/:id',
                        methods: ['DELETE'],
                        ownershipCheck: {
                            paramName: 'id',
                            matchField: 'sub'
                        }
                    }
                ]
            },
            {
                routeName: 'restaurants',
                BaseUrl: (process.env.restaurant_SERVICE_URL || 'http://localhost:4003') + '/restaurants',
                enabled: true,
                publicRoutes: [
                    {
                        path: '/',
                        methods: ['GET']
                    },
                    {
                        path: '/:id',
                        methods: ['GET']
                    }
                ],
                protectedRoutes: [
                    {
                        path: '/:id',
                        methods: ['DELETE'],
                        ownershipCheck: {
                            paramName: 'id',
                            matchField: 'sub'
                        }
                    },
                    {
                        path: '/admin',
                        methods: ['GET'],
                        allowedRoles: ['admin']
                    }
                ]
            },
            {
                routeName: 'orders',
                BaseUrl: (process.env.restaurant_SERVICE_URL || 'http://localhost:4004') + '/orders',
                enabled: true
            }
        ]
    };

    return defaultConfig;
}