"use client";

import api from "./api";
import { useQuery } from "@tanstack/react-query";

export const useGetBalance = () => {
  return useQuery<number, Error>({
    queryKey: ["balance"],
    queryFn: async () => {
      const response = await api.get("/balance");
      return response.data.balance;
    },
  });
};
