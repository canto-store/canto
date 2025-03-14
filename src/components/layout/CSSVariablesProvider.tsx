"use client";

import { ReactNode, useEffect, useLayoutEffect } from "react";
import { useBanner } from "@/providers";

interface CSSVariablesProviderProps {
  children: ReactNode;
}

// Create a safe useLayoutEffect that falls back to useEffect in SSR
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function CSSVariablesProvider({ children }: CSSVariablesProviderProps) {
  const { showBanner } = useBanner();

  // Use useLayoutEffect to set CSS variables before browser paint
  useIsomorphicLayoutEffect(() => {
    const updateLayoutVariables = () => {
      const root = document.documentElement;
      const isMobile = window.innerWidth < 768;
      let headerHeight;

      if (showBanner) {
        headerHeight = isMobile ? "6rem" : "7rem";
      } else {
        headerHeight = isMobile ? "4rem" : "4.5rem";
      }

      root.style.setProperty("--header-height", headerHeight);

      // Set main-height based on current header height and bottom nav height
      // Bottom nav height is controlled by CSS media queries in globals.css
      const bottomNavHeight = isMobile ? "4rem" : "0";
      root.style.setProperty(
        "--main-height",
        `calc(100vh - ${headerHeight} - ${bottomNavHeight})`,
      );
    };

    // Set variables immediately on mount
    updateLayoutVariables();

    // Update on resize
    window.addEventListener("resize", updateLayoutVariables);

    return () => window.removeEventListener("resize", updateLayoutVariables);
  }, [showBanner]);

  // Add a style element to handle the bottom navigation height with CSS media queries
  useIsomorphicLayoutEffect(() => {
    // Create a style element if it doesn't exist
    let styleElement = document.getElementById("css-variables-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "css-variables-style";
      document.head.appendChild(styleElement);
    }

    // Set the media query rules
    styleElement.textContent = `
      @media (min-width: 768px) {
        :root {
          --bottom-nav-height: 0;
        }
        .md\\:hidden {
          display: none;
        }
      }
    `;

    return () => {
      // Clean up the style element on unmount
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  return <>{children}</>;
}
