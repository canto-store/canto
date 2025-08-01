"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import { AlertOctagon } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  const router = useRouter();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    });
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <AlertOctagon className="text-orange-red h-20 w-20" />
      <h1 className="mt-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-2 text-gray-600">
        Sorry, the page you are looking for does not exist.
      </p>
      <Button onClick={() => router.push("/")} className="mt-4">
        Go to Homepage
      </Button>
    </div>
  );
}
