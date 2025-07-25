import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { ErrorResponse } from "@/types/response";
import {
  AddServicePayloadType,
  AddServiceValuesType,
} from "@/components/Service/schema/ServiceSchema";
import { formatDate } from "date-fns";

const queryKey = ["GetServices"];
export const useAddServiceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, ErrorResponse, AddServicePayloadType>({
    mutationFn: async (data: AddServicePayloadType) => {
      return api.post(`services`, data).then((res) => res.data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
      await queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: false,
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return api.delete(`services/${id}`).then((res) => res.data);
    },
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
    onSettled: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export const useUpdateService = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<any, ErrorResponse, AddServicePayloadType>({
    mutationFn: async (data: AddServicePayloadType) =>
      await api
        .patch(`/services/` + id, {
          ...data,
          retrieveDate:
            formatDate(data.retrievedDate, "yyyy-MM-dd") || undefined,
        })
        .then((res) => res.data),
    onSuccess: async () => {
      return await queryClient.invalidateQueries({
        queryKey,
        exact: false,
      });
    },
  });
};
