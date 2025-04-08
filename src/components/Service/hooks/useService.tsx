// import { useAddServiceMutation } from "@/api/service/service.mutation";
// import { useGetServiceQuery } from "@/api/service/service.query";
// import { useCurrentUser } from "@/api/user/current-user";
// import { parseAsString, useQueryState } from "nuqs";
// import { useState } from "react";
// import { useForm } from "react-hook-form";

// export const useService = () => {
//   const { data: services, isLoading } = useGetServiceQuery();
//   const { mutate } = useAddServiceMutation();
//   // const { mutate: deleteService } = useAddServiceMutation();
//   const form = useForm();
//   const { data: user, isLoading: userLoading } = useCurrentUser();
//   // const []= useQueryState('search',parseAsString.withDefault(''))
//   // const [date, setDate] = useQueryState(
//   //   "date",
//   //   parseAsString.withDefault(new Date().toDateString())
//   // );
//   console.log(user);

//   const handleAddService = () => {
//     const payload = form.getValues();

//     mutate(payload);
//   };

//   const handleDeleteService = (id: string) => {
//     // deleteService(id);
//   };
//   return {
//     user,
//     form,
//     services,
//     isLoading,
//     handleAddService,
//     handleDeleteService,
//   };
// };
