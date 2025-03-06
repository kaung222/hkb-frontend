import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { Service } from "@/types/service";
interface GetServiceProps {
  queryKey: any;
  filterDate: any;
}
export const useGetServiceQuery = () => {
  const startDate = new Date("2025-03-05");
  const endDate = new Date("2025-03-07");

  return useQuery<Service[]>({
    queryKey: ["GetServices", startDate, endDate],
    queryFn: async () => {
      return api
        .get(`/services/by/created-date`, {
          params: {
            startDate,
            endDate,
          },
        })
        .then((res) => res.data);
    },
  });
};
