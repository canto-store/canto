import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: ReactNode;
  title?: string;
  className?: string;
  containerClassName?: string;
  background?: "default" | "background" | "white";
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
      default:
        return "";
    }
  };

  return (
    <section className={cn("px-4 py-16", getBgColor(), className)}>
      <div className={cn("container mx-auto", containerClassName)}>
        {title && <h2 className="mb-8 text-3xl font-bold">{title}</h2>}
        {children}
      </div>
    </section>
  );
}
