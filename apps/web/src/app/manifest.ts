import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Canto",
    short_name: "Canto",
    description: "Canto Progressive Web App",
    start_url: "/",
    id: "/",
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon-167x167.png",
        sizes: "167x167",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-touch-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
        purpose: "any",
      },
    ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    prefer_related_applications: false,
    categories: ["shopping", "lifestyle"],
    screenshots: [
      // iPhone 16 Pro Max
      {
        src: "/apple-splash-1320-2868.png",
        sizes: "1320x2868",
        type: "image/png",
        platform: "ios",
        label: "Canto App on iPhone 16 Pro Max",
      },
      // iPhone 15 Pro Max
      {
        src: "/apple-splash-1290-2796.png",
        sizes: "1290x2796",
        type: "image/png",
        platform: "ios",
        label: "Canto App on iPhone 15 Pro Max",
      },
      // iPhone 14 Pro
      {
        src: "/apple-splash-1170-2532.png",
        sizes: "1170x2532",
        type: "image/png",
        platform: "ios",
        label: "Canto App on iPhone 14 Pro",
      },
      // iPhone 11 Pro Max / XS Max
      {
        src: "/apple-splash-1242-2688.png",
        sizes: "1242x2688",
        type: "image/png",
        platform: "ios",
        label: "Canto App on iPhone",
      },
      // iPad Pro
      {
        src: "/apple-splash-2048-2732.png",
        sizes: "2048x2732",
        type: "image/png",
        platform: "ipados",
        label: "Canto App on iPad",
      },
    ],
    shortcuts: [
      {
        name: "Home",
        url: "/",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192" }],
      },
      {
        name: "Browse",
        url: "/browse",
        icons: [{ src: "/web-app-manifest-192x192.png", sizes: "192x192" }],
      },
    ],
    lang: "en",
    dir: "ltr",
    related_applications: [],
  };
}
