"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShareIcon, PlusIcon } from "lucide-react";

export default function InstallPrompt() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS device
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (sessionStorage.getItem("install-prompt-dismissed") === "true") {
        return;
      }
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setOpen(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  useEffect(() => {
    if (isIOS) {
      const isInStandaloneMode = () =>
        "standalone" in window.navigator &&
        (window.navigator as any).standalone;

      if (!isInStandaloneMode()) {
        if (sessionStorage.getItem("install-prompt-dismissed") === "true") {
          return;
        }
        setOpen(true);
      }
    }
  }, [isIOS]);

  const handleInstall = async () => {
    if (isIOS) {
      // Show iOS instructions modal
      setShowIOSModal(true);
      setOpen(false);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    setDeferredPrompt(null);
    setOpen(false);
  };

  const handleNotNow = () => {
    sessionStorage.setItem("install-prompt-dismissed", "true");
    setOpen(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <div className="flex flex-col items-center gap-3">
              <Image
                src="/logo-yellow-burgandy.png"
                alt="Canto Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div className="text-center">
                <SheetTitle>Install App</SheetTitle>
                <SheetDescription>
                  Add this app to your device for faster and easier access.
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <SheetFooter>
            <Button variant="outline" onClick={handleNotNow}>
              Not now
            </Button>

            <Button onClick={handleInstall}>
              {isIOS ? "View Instructions" : "Install"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={showIOSModal} onOpenChange={setShowIOSModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Install on iOS
            </DialogTitle>
          </DialogHeader>

          <ul className="space-y-4 py-4">
            <li className="text-sm">
              Tap the <ShareIcon className="mx-1 inline size-4" />
              <strong>Share</strong> button
            </li>

            <li className="text-sm">
              Look for <PlusIcon className="mx-1 inline size-4" />
              <strong>Add to Home Screen</strong> and tap it
            </li>

            <li className="text-sm">
              Tap <strong>Add</strong> in the top-right corner to confirm
            </li>
          </ul>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowIOSModal(false)}
              className="w-full"
            >
              Got it
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
