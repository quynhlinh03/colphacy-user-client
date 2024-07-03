import { useMutation, useQuery } from "@tanstack/react-query";
import {
  REQUEST_DETAIL_RECEIVERS_ADDRESS,
  REQUEST_DISTRICTS,
  REQUEST_PROVINCES,
  REQUEST_RECEIVERS_ADDRESS,
  REQUEST_WARDS,
} from "../constants/apis";
import axios from "../settings/axios";

export function useReceiverAddress(provinceId: number, districtId: number) {
  const fetchProvinces = useQuery({
    queryKey: ["provinces"],
    queryFn: () => {
      return axios.get(REQUEST_PROVINCES);
    },
    enabled: false,
  });

  const fetchDistricts = useQuery({
    queryKey: ["districts"],
    queryFn: () => axios.get(REQUEST_DISTRICTS(provinceId)),
    enabled: false,
  });
  const fetchWards = useQuery({
    queryKey: ["wards"],
    queryFn: () => axios.get(REQUEST_WARDS(districtId)),
    enabled: false,
  });
  return {
    fetchProvinces,
    fetchDistricts,
    fetchWards,
  };
}

export function useReceiver() {
  const fetchListReceiverAddress = useQuery({
    queryKey: ["add_new_receivers_address"],
    queryFn: () => {
      return axios.get(REQUEST_RECEIVERS_ADDRESS);
    },
  });
  const handleAddReceiverAddress = useMutation({
    mutationKey: ["add_new_receivers_address"],
    mutationFn: (data: Receivers) => {
      return axios.post(REQUEST_RECEIVERS_ADDRESS, data);
    },
  });

  const onSubmitAddReceiverAddress = (
    data: Receivers,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleAddReceiverAddress.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  const handleEditReceiverAddress = useMutation({
    mutationKey: ["add_new_receivers_address"],
    mutationFn: (data: Receivers) => {
      return axios.put(REQUEST_RECEIVERS_ADDRESS, data);
    },
  });

  const onSubmitEditReceiverAddress = (
    data: Receivers,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleEditReceiverAddress.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    onSubmitAddReceiverAddress,
    fetchListReceiverAddress,
    onSubmitEditReceiverAddress,
  };
}

export function useDetailReceiver(id: number) {
  const fetchDetailReceiverAddress = useQuery({
    queryKey: ["add_new_receivers_address"],
    queryFn: () => {
      if (id) {
        return axios.get(REQUEST_DETAIL_RECEIVERS_ADDRESS(id));
      } else {
        return Promise.resolve(null);
      }
    },
  });
  const handleDeleteReceiverAddress = useMutation({
    mutationKey: ["delete_receivers_address"],
    mutationFn: (id: number) => {
      return axios.delete(REQUEST_DETAIL_RECEIVERS_ADDRESS(id));
    },
  });
  const onSubmitDeleteReceiverAddress = (
    id: number,
    onSuccess: () => void,
    onError: (error: object) => void
  ) => {
    handleDeleteReceiverAddress.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    fetchDetailReceiverAddress,
    handleDeleteReceiverAddress,
    onSubmitDeleteReceiverAddress,
  };
}
