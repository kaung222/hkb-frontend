import { useQuery } from "@tanstack/react-query";
import api from "../api";

interface GetItemProps {
  filterDate: string;
}
export const useGetItemsQuery = ({ filterDate }: GetItemProps) => {
  return useQuery({
    queryKey: ["items", filterDate],
    queryFn: async () => {
      const response = await api.post("/api/hkb.php?op=getItem", {
        filterDate,
      });
      return response.data[0].item;
    },
  });
};

interface GetSalesProps {
  filterDate: string;
}

export const useGetSalesQuery = ({ filterDate }: GetSalesProps) => {
  return useQuery({
    queryKey: ["sales", filterDate],
    queryFn: async () => {
      const response = await api.post("/api/hkb.php?op=getItem", {
        filterDate,
      });
      return response.data[0].sale;
    },
  });
};
