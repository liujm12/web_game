export function readGameScreenshotPreset() {
  if (typeof window === "undefined" || process.env.NODE_ENV === "production") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("screenshot");
}
