import { defineRouting } from 'next-intl/routing';
import { createSharedPathnamesNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ar', 'en'], // Supported locales
  defaultLocale: 'ar',   // Default locale
});

// Navigation hooks
export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation(routing);
