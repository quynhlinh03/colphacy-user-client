import {
  REQUEST_ADD_PRODUCT_CART,
  REQUEST_CART,
  REQUEST_PRODUCTCART_DELETE,
  REQUEST_PRODUCTCART_UPDATE,
} from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { handleGlobalException } from "../utils/error";
import { useEffect } from "react";
import useAuth from "./useAuth";
function useCart() {
  const { isAuthenticated } = useAuth();
  const { refetch: fetchCart, data: cartData } = useQuery({
    queryKey: ["get-cart"],
    queryFn: () => {
      return axios.get(REQUEST_CART);
    },
    enabled: false,
  });
  const handleAddProductCart = useMutation({
    mutationKey: ["add_product_cart"],
    mutationFn: (data: AddProductCartProps) => {
      return axios.post(REQUEST_ADD_PRODUCT_CART, data);
    },
  });

  const onSubmitAddPrductCart = (
    data: AddProductCartProps,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleAddProductCart.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const handleDeleteProductCart = useMutation({
    mutationKey: ["delete-productCart"],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_PRODUCTCART_DELETE(data.id));
    },
  });
  const handleUpdateProductCart = useMutation({
    mutationKey: ["update-productCart"],
    mutationFn: (data: { id: number; quantity: number }) => {
      return axios.put(REQUEST_PRODUCTCART_UPDATE(data.id), {
        quantity: data.quantity,
      });
    },
  });
  const onSubmitDeleteProductCart = (
    data: { id: number },
    onSuccess: () => void
  ) => {
    handleDeleteProductCart.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {});
      },
    });
  };
  const onSubmitUpdateProductCart = (data: {
    id: number;
    quantity: number;
  }) => {
    handleUpdateProductCart.mutate(data, {
      onSuccess: () => {},
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {});
      },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);
  return {
    fetchCart,
    cartData,
    onSubmitDeleteProductCart,
    onSubmitUpdateProductCart,
    handleAddProductCart,
    onSubmitAddPrductCart,
  };
}

export default useCart;
