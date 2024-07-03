import { useMutation, useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import { useEffect, useState } from "react";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { notificationShow } from "../components/Notification";
import { OrderHistoryItem } from "../components/OrderHistory/type";
interface ApiResponse {
  data: {
    items: OrderHistoryItem[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  } | null;
}

export default function useOrderHistory(
  offset?: number | undefined,
  keyword?: string | undefined,
  startDate?: Date | undefined,
  endDate?: Date | undefined,
  status: string | undefined
) {
  const fetchOrder = useQuery<ApiResponse>({
    queryKey: ["get-orders"],
    queryFn: () => {
      const params: { [key: string]: number | string | Date } = {};
      if (offset) {
        params.offset = offset;
      }
      if (status) {
        params.status = status == "null" ? "" : status;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (startDate) {
        params.startDate = new Date(startDate).toISOString().slice(0, 10);
      }
      if (endDate) {
        params.endDate = new Date(endDate).toISOString().slice(0, 10);
      }
      return axios.get("/orders/customer", { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });
  const changeStatusOrder = useMutation({
    mutationKey: ["update-status-order"],
    mutationFn: (data: { id: number }) => {
      return axios.put(`/orders/cancel/${data.id}`);
    },
  });
  const handleChangeStatusOrder = (data: {
    id: number;
    toStatus: string | null;
  }) => {
    changeStatusOrder.mutate(data, {
      onSuccess: () => {
        fetchOrder.refetch();
      },
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            notificationShow("error", "Error!", data["toStatus"]);
          }
        });
      },
    });
  };

  const confirmOrder = useMutation({
    mutationKey: ["confirm-order"],
    mutationFn: (data: { id: number; toStatus: string | null }) => {
      return data.toStatus !== "CANCELLED"
        ? axios.put(`/orders/customer/complete/${data.id}`)
        : axios.put(`/orders/customer/return/${data.id}`);
    },
  });
  const handleconfirmOrder = (data: {
    id: number;
    toStatus: string | null;
  }) => {
    confirmOrder.mutate(data, {
      onSuccess: () => {
        fetchOrder.refetch();
        
        notificationShow("success", "Success!", data.toStatus === "CANCELLED"?"Yêu cầu trả hàng thành công":"Đã nhận hàng");
      },
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            notificationShow("error", "Error!", data["toStatus"]);
          }
        });
      },
    });
  };
  useEffect(() => {
    fetchOrder.refetch();
  }, [status, startDate, endDate, keyword, offset]);
  return {
    OrderData: fetchOrder.data?.data,
    fetchOrder,
    handleChangeStatusOrder,
    handleconfirmOrder,
  };
}

export function useOrderHistoryDetail(id: number | undefined) {
  const fetchDetailOrder = useQuery({
    queryKey: ["get-detail-history-order"],
    enabled: false,
    queryFn: () => {
      return axios.get(`/orders/customer/${id}`);
    },
  });
  const detailOrder = fetchDetailOrder.data?.data;
  const RebuyHistoryOrder = useMutation({
    mutationKey: ["add-detail-history-order-to-cart"],
    mutationFn: (data: { items: AddProductCartProps[] }) => {
      return axios.post(`/carts`, data);
    },
  });

  const onSubmitRebuyOrder = (
    data: { items: AddProductCartProps[] },
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    RebuyHistoryOrder.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const fetchLink = async (id: number) => {
    try {
      const data = await axios.get(`/orders/payments/${id}`);
      window.open(data.data.data);
    } catch (error) {}
  };
  return {
    fetchDetailOrder,
    onSubmitRebuyOrder,
    detailOrder,
    fetchLink
  };
}
