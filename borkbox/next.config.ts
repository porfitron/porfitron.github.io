import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emits a static site under `out/` (includes `out/index.html` + `out/_next/`).
  // Deploy the whole `out/` folder; moving only `index.html` to another root breaks asset URLs.
  output: "export",
};

export default nextConfig;
