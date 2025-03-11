import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const t = useTranslations("pagination");
  const params = useParams();
  const isRTL = params.locale === "ar";

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis-end");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  // Convert to Arabic numerals if needed
  const formatNumber = (num: number): string => {
    if (!isRTL) return num.toString();

    // Convert to Arabic numerals
    const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return num.toString().replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
  };

  // Create navigation buttons with correct icons for RTL/LTR
  const prevButton = (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      aria-label={t("previous")}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );

  const nextButton = (
    <Button
      variant="outline"
      size="icon"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      aria-label={t("next")}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );

  return (
    <nav
      className={cn("flex items-center justify-center gap-2 py-8", className)}
      dir={isRTL ? "rtl" : "ltr"}
      aria-label="Pagination"
    >
      {/* In RTL mode, we swap the positions of next and previous buttons */}
      {isRTL ? nextButton : prevButton}

      <div
        className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
      >
        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            );
          }

          const pageNum = page as number;
          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(pageNum)}
              aria-label={`${t("page")} ${pageNum}`}
              aria-current={currentPage === pageNum ? "page" : undefined}
            >
              {formatNumber(pageNum)}
            </Button>
          );
        })}
      </div>

      {/* In RTL mode, we swap the positions of next and previous buttons */}
      {isRTL ? prevButton : nextButton}
    </nav>
  );
}
