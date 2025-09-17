import { useQuery } from "@tanstack/react-query";
import api from "./api";

export function useGetWishlist() {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const { data } = await api.get("/wishlist");
      return data;
    },
  });
}
