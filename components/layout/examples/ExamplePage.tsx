"use client";

import { AppLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExamplePage() {
  const [theme, setTheme] = useState<"default" | "custom">("default");
  const [showBanner, setShowBanner] = useState(false);
  const [useContainer, setUseContainer] = useState(true);

  return (
    <div>
      {/* Controls outside the layout */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 rounded-lg bg-white p-4 shadow-lg">
        <h3 className="font-medium">Layout Controls</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "default" ? "custom" : "default")}
          >
            Theme: {theme}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBanner(!showBanner)}
          >
            Banner: {showBanner ? "On" : "Off"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseContainer(!useContainer)}
          >
            Container: {useContainer ? "On" : "Off"}
          </Button>
        </div>
      </div>

      {/* The AppLayout with dynamic props */}
      <AppLayout theme={theme}>
        <div className="my-8 rounded-lg border p-6">
          <h1 className="mb-4 text-2xl font-bold">AppLayout Example</h1>
          <p className="mb-4">
            This example demonstrates the unified AppLayout component that
            replaces both PageLayout and PageShell. Use the controls in the
            bottom left to see how different configurations affect the layout.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">Card {i + 1}</h3>
                <p className="text-sm text-gray-500">
                  This is an example card to demonstrate the layout.
                </p>
              </div>
            ))}
          </div>
        </div>
      </AppLayout>
    </div>
  );
}
