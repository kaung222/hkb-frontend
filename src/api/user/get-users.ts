import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { User } from "@/types/user";

export const useGetUser = () => {
  return useQuery<User[]>({
    queryKey: ["GetUsers"],
    queryFn: async () => {
      return await api.get("users").then((res) => res.data);
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
