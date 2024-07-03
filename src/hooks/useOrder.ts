import { notificationShow } from "../components/Notification";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { handleGlobalException } from "../utils/error";
import { REQUEST_CREATE_ORDER } from "./../constants/apis";
import { useMutation } from "@tanstack/react-query";

export function useOrder() {
  const handleCreateOrder = useMutation({
    mutationKey: ["create_order"],
    mutationFn: (data: Orders) => {
      return axios.post(REQUEST_CREATE_ORDER, data);
    },
  });
  // const onSubmitCreateOrder = (data: Orders, onSuccess: () => void) => {
  //   handleCreateOrder.mutate(data, {
  //     onSuccess: onSuccess,
  //     onError: (error) => {
  //       const newError = error as ErrorObject;
  //       handleGlobalException(newError, () => {
  //         if (newError.response.status === 400) {
  //           const data = newError.response.data;
  //           notificationShow("error", "Error!", data.error);
  //         }
  //       });
  //     },
  //   });
  // };
  const onSubmitCreateOrder = (data: Orders, onSuccess: (response: any) => void) => {
    handleCreateOrder.mutate(data, {
      onSuccess: (response) => {
      // Handle the API response here
      console.log('API Response:', response);

      // You can use the response data as needed
      // For example, you might want to show a success message or perform additional actions based on the response.

      // Call the provided onSuccess callback
      onSuccess(response);
    },
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            notificationShow("error", "Error!", data.error);
          }
        });
      },
    });
  };
  return {
    handleCreateOrder,
    onSubmitCreateOrder,
  };
}
