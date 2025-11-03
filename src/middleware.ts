import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';
import { restrictedRoutes } from './utils/routesConfig';
import { hasAccess } from './utils/accessUtils';
import { verifyRefreshToken } from './utils/auth';
import { getLocaleFromPath } from './utils/localeUtils';
import { IDecodedToken } from './interfaces';
import { IAdminPermissions, UserRoleTypes } from './types';

const intlMiddleware = createIntlMiddleware({ locales: ['ar', 'en'], defaultLocale: 'ar' });

export default async function middleware(req: NextRequest) {
    const response = intlMiddleware(req);
    const { pathname } = req.nextUrl;
    const locale = getLocaleFromPath(pathname);

    if (pathname === '/' || pathname === `/${locale}`) {
        return NextResponse.redirect(new URL('/ar/dashboard', req.url));
    }

    const cookieStore = cookies();
    // let accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('auth-token')?.value;
    // console.log(refreshToken);

    if (pathname.includes('/login')) {
        if (refreshToken) return NextResponse.redirect(new URL(`/${locale}`, req.url));
        return response;
    }

    let routeAccess = Object.keys(restrictedRoutes).find(route => pathname.includes(route));

    if (routeAccess) {
        if (!refreshToken) {
            // try {
            //     const { data: { accessToken: token }, success } = await postData<{ accessToken: string }>({ endpoint: `/auth/refresh-token/?refreshToken=${refreshToken}` }) as any;
            //     if (success) accessToken = token;
            //     else return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
            // } catch {
            //     return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
            // }
            return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
        }

        try {
            let role = "";
            let permissions = [] as IAdminPermissions[];
            if (refreshToken) {
                const decoded: IDecodedToken | null = await verifyRefreshToken(refreshToken);
                // console.log(decoded)
                if (decoded) {
                    role = decoded.role || "";
                    permissions = decoded.permissions || [];
                }
            }

            if (!hasAccess({
                requiredRoles: restrictedRoutes[routeAccess].roles,
                userRole: role as UserRoleTypes,
                requiredPermission: restrictedRoutes[routeAccess].permission,
                permissions
            })) {
                // Delete the auth token by setting it to expire immediately
                // const response = NextResponse.redirect(new URL(`/${locale}/not-authorized`, req.url));
                const response = NextResponse.redirect(new URL(`/${locale}/login`, req.url));
                response.cookies.set('auth-token', '', { 
                    expires: new Date(0),
                    path: '/'
                });
                return response;
            }
        } catch {
            return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
        }
    }

    return response;
}

export const config = { matcher: ['/', '/(ar|en)/:path*'] };
