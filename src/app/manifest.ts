import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Potty Pattern Tracker",
    short_name: "Potty Tracker",
    description: "A private, device-local potty training tracker.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EE",
    theme_color: "#FAF5EE",
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
