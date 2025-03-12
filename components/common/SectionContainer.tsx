import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  title?: string;
  className?: string;
  containerClassName?: string;
  background?: "default" | "background" | "white" | "tertiary";
}

export function SectionContainer({
  children,
  title,
  className,
  containerClassName,
  background = "default",
}: SectionContainerProps) {
  const getBgColor = () => {
    switch (background) {
      case "background":
        return "bg-background";
      case "white":
        return "bg-white";
      case "tertiary":
        return "bg-tertiary text-tertiary-foreground";
      default:
        return "";
    }
  };

  return (
    <section className={cn(getBgColor(), className)}>
      <div className={cn("container mx-auto", containerClassName)}>
        {title && (
          <h2
            className={cn(
              "mb-8 text-3xl font-bold",
              background === "tertiary" ? "text-tertiary-foreground" : "",
            )}
          >
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
