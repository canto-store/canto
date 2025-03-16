import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import withTM from "next-transpile-modules";

const withTranspileModules = withTM(["react-haiku"]);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(withTranspileModules(nextConfig));
