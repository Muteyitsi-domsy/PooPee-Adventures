import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // The webpack-based InjectManifest plugin doesn't support Turbopack (used by
  // `next dev`); only build the service worker for production.
  disable: process.env.NODE_ENV !== "production",
});

const nextConfig: NextConfig = {
  // Acknowledges the webpack config Serwist adds (used only for the production
  // build; see `disable` above) so Turbopack's dev server doesn't treat it as
  // an accidental/unmigrated webpack config and refuse to start.
  turbopack: {},
};

export default withSerwist(nextConfig);
