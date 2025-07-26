import { useQuery } from "@tanstack/react-query";
import api from "./api";

type Sector = {
  id: string;
  name: string;
};

export const useGetAllSectors = () =>
  useQuery<Sector[], Error>({
    queryKey: ["sectors"],
    queryFn: async () => {
      const { data } = await api.get<Sector[]>("/delivery");
      return data;
    },
    staleTime: 30 * 60 * 1000,
  });
