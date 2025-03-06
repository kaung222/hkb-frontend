import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { User } from "@/types/user";

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["GetProfile"],
    queryFn: async () => {
      return await api.get("/users/my/profile").then((res) => res.data);
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
