import { useMutation } from "@tanstack/react-query";
import api from "../api";
import { z } from "zod";
import { LoginFormSchema } from "@/components/Login/Login";
import { ErrorResponse } from "@/types/response";

type LoginPayload = z.infer<typeof LoginFormSchema>;
type LoginResponse = {
  accessToken: string;
};
export const useLogin = () => {
  return useMutation<LoginResponse, ErrorResponse, LoginPayload>({
    mutationFn: async (payload: LoginPayload) => {
      return await api.post("auth/login", payload).then((res) => res.data);
    },
  });
};
