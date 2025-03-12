"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// Define the banner context type
interface BannerContextType {
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  closeBanner: () => void;
  isLoading: boolean;
}

// Create the banner context with default values
const BannerContext = createContext<BannerContextType>({
  showBanner: true,
  setShowBanner: () => {},
  closeBanner: () => {},
  isLoading: true,
});

// Custom hook to use the banner context
export const useBanner = () => useContext(BannerContext);

interface BannerProviderProps {
  children: ReactNode;
  initialState?: boolean;
}

export function BannerProvider({
  children,
  initialState = true,
}: BannerProviderProps) {
  // Start with loading state to prevent flash
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState<boolean>(initialState);

  // Load banner state from localStorage on mount
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    try {
      const storedBannerState = localStorage.getItem("bannerClosed");
      if (storedBannerState !== null) {
        setShowBanner(storedBannerState !== "true");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    } finally {
      // Mark as loaded regardless of success/failure
      setIsLoading(false);
    }
  }, []);

  // Save banner state to localStorage whenever it changes
  useEffect(() => {
    // Skip during loading phase and on server
    if (isLoading || typeof window === "undefined") return;

    try {
      localStorage.setItem("bannerClosed", (!showBanner).toString());
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  }, [showBanner, isLoading]);

  // Close the banner
  const closeBanner = () => {
    setShowBanner(false);
  };

  return (
    <BannerContext.Provider
      value={{
        showBanner,
        setShowBanner,
        closeBanner,
        isLoading,
      }}
    >
      {children}
    </BannerContext.Provider>
  );
}
