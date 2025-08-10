"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="mb-4 text-6xl text-red-600">⚠️</div>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Something went wrong!
            </h2>
            <p className="mb-6 text-gray-600">
              We&apos;re experiencing technical difficulties. Please try again
              later.
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
