import { useMemo } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "next/image";
import { ProductDetails as ProductDetailsType } from "@/types";

function ProductImages({
  product,
  setApi,
}: {
  product: ProductDetailsType;
  setApi: (api: CarouselApi) => void;
}) {
  const images = useMemo(() => {
    return product.variants.flatMap((variant) =>
      variant.images.map((image) => ({
        url: image.url,
        alt: image.alt_text || product.name,
      })),
    );
  }, [product.variants, product.name]);
  return (
    <div className="relative w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.url} className="basis-full">
              <div className="relative aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white/90" />
            <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white/90" />
          </>
        )}
      </Carousel>
    </div>
  );
}

export default ProductImages;
