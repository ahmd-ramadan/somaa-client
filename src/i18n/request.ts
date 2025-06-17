import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // If locale is not provided, use the default locale
  if (!locale) {
    locale = routing.defaultLocale; // Set to default locale ('ar')
  }

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound(); // Return 404 if the locale is invalid
  }

  // Load messages for the locale
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
