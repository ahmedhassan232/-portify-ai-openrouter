import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  // Native canvas and OCR binaries must stay external to the webpack bundle.
  serverExternalPackages: ["mammoth", "@napi-rs/canvas", "tesseract.js"],
  async headers() {
    return [{ source: "/(.*)", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ] }];
  },
};
export default config;
