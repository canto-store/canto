"use client";

import { useRef, useState, useEffect } from "react";
import { ShoppingCart, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import { CartItemComponent } from "./CartItem";
import { cn } from "@/lib/utils";

interface CartDropdownProps {
  className?: string;
}

export function CartDropdown({ className }: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { items, count, total } = useCart();
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle hover state with delay for better UX
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isHovering) {
      setIsOpen(true);
    } else {
      // Add a small delay before closing to prevent accidental closures
      timeoutId = setTimeout(() => {
        if (!isHovering) {
          setIsOpen(false);
        }
      }, 300);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push("/cart");
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  // Get the appropriate chevron icon based on language direction
  const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div
      className={cn("relative", className)}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={() => router.push("/cart")}
        className="text-primary hover:bg-primary/10 relative flex h-10 w-10 items-center justify-center rounded-full transition-all"
        aria-label={t("header.cart")}
      >
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
            {count}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "ring-primary ring-opacity-5 absolute z-50 mt-2 w-80 rounded-md bg-white py-2 shadow-lg ring-1",
            isRTL ? "right-auto left-0" : "right-0 left-auto",
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="border-b border-gray-100 px-4 py-3">
            <h3 className="text-primary font-medium">
              {count > 0 ? t("header.yourCart", { count }) : t("header.cart")}
            </h3>
          </div>

          {count > 0 ? (
            <>
              {/* Cart Items */}
              <div className="max-h-60 overflow-y-auto py-3">
                {items.map((item) => (
                  <CartItemComponent
                    key={`${item.name}-${item.quantity}`}
                    item={item}
                    showControls={false}
                    showRemoveButton={true}
                    compact
                    className="px-4 py-2 transition-colors hover:bg-gray-50"
                  />
                ))}
              </div>

              {/* Cart Total */}
              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex justify-between font-medium">
                  <span>{t("header.total")}:</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Cart Actions */}
              <div className="flex gap-3 border-t border-gray-100 px-4 py-3">
                <Button
                  variant="outline"
                  className="h-9 flex-1 text-sm"
                  onClick={handleViewCart}
                >
                  {t("header.viewCart")}
                </Button>
                <Button className="h-9 flex-1 text-sm" onClick={handleCheckout}>
                  {t("header.checkout")}{" "}
                  <ChevronIcon className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-4 text-gray-500">{t("cart.emptyCart")}</p>
              <Button
                className="text-sm"
                onClick={() => router.push("/browse")}
              >
                {t("cart.startShopping")}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
