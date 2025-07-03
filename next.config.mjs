import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
