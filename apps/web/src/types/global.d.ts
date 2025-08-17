// src/types/global.d.ts (or wherever you keep your type declarations)

interface Navigator {
  /**
   * Indicates if the web application is running in standalone mode (PWA).
   * Supported primarily by Safari on iOS.
   */
  standalone?: boolean;
}
