export function FontPreloader() {
  return (
    <>
      {/* Preload critical fonts to prevent layout shifts */}
      <link
        rel="preload"
        href="/fonts/SpaceGrotesk.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/Optician-Sans.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* Preconnect to Google Fonts for Arabic font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
    </>
  );
}
