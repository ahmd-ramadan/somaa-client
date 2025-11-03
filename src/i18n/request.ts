import { notFound } from 'next/navigation';
import { getRequestConfig, GetRequestConfigParams } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }: GetRequestConfigParams) => {
  // Use the new requestLocale approach
  const locale = await requestLocale;


  // If locale is not provided, use the default locale
  if (!locale) {
    return {
      locale: routing.defaultLocale,
      messages: (await import(`../messages/${routing.defaultLocale}.json`)).default,
    };
  }

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound(); // Return 404 if the locale is invalid
  }

  // Load messages for the locale
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
