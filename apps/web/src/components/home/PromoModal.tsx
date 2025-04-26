import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FormInput } from "../ui/form-input";
import { Label } from "../ui/label";
interface PromoModalProps {
  displayDelay?: number;
}

export function PromoModal({ displayDelay = 2000 }: PromoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, displayDelay);
    return () => clearTimeout(timer);
  }, [displayDelay]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-global sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome to Canto
          </DialogTitle>
          <DialogDescription>
            Subscribe to our newsletter to get the latest news and updates. And
            enjoy a 15% discount on your first order.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Email</Label>
          <FormInput type="email" placeholder="email@example.com" />
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() => {
              setIsOpen(false);
              toast.success("Subscribed to newsletter");
            }}
          >
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
