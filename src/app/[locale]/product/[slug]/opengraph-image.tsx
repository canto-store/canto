import { useProduct } from "@/lib/product";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Product Image";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const { slug } = params;
  const { data: product } = useProduct({ slug });
  if (!product) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            fontSize: 48,
            background: "white",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Product Not Found
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 48,
          background: "white",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "70%",
            overflow: "hidden",
            borderRadius: 16,
            marginBottom: 32,
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: 48,
              fontWeight: "bold",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {product.name}
          </h1>
          <p
            style={{
              fontSize: 32,
              color: "#666",
              textAlign: "center",
            }}
          >
            {product.price.toLocaleString("en-US", {
              style: "currency",
              currency: "EGP",
            })}
          </p>
        </div>
      </div>
    ),
    { ...size },
  );
}
