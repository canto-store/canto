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

export const useGetSales = () => {
  return useQuery<number, Error>({
    queryKey: ["sales"],
    queryFn: async () => {
      const response = await api.get("/sales");
      return response.data.sales;
    },
  });
};
