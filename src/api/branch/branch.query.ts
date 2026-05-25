import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Branch } from "@/types/branch";

export const useGerBraches = () => {
  return useQuery<Branch[]>({
    queryKey: ["GetBranches"],
    queryFn: async () => {
      return await api.get("branches").then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useMigration = () => {
  return useQuery({
    queryKey: ["GetMigration"],
    queryFn: async () => {
      return await api.get("/services/run/migration").then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
