import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    start_url: "/",
    scope: "/",
    name: "Canto Store",
    short_name: "Canto",
    description: "Egyptian Marketplace",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    icons: [
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "/logo-maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-maskable-1024.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    orientation: "portrait",
    shortcuts: [
      {
        name: "Home",
        url: "/",
        icons: [{ src: "/logo-192.png", sizes: "192x192" }],
      },
      {
        name: "Browse",
        url: "/browse",
        icons: [{ src: "/logo-192.png", sizes: "192x192" }],
      },
    ],
    lang: "en",
    dir: "ltr",
  };
}
