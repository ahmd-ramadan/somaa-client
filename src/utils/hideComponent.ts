


export const hideDashboardRoutes = [
    'login', 
    'signup',
    'verify-account',
    'forgot-password',
    'reset-password',
    'error',
    'not-authorized'
];

export const hidesComponent = (currPathname: string) => {
    const isRouteOpen: boolean = !hideDashboardRoutes.includes(currPathname);

    return {
        isRouteOpen
    }
}

export const hidesSideBar = (currPathname: string): boolean => {
    for(const route of hideDashboardRoutes) {
        if (currPathname.includes(route)) return true
    }
    return false;
}