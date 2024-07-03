import { useQuery } from "@tanstack/react-query";
import { REQUEST_GET_CATEGORY } from "../constants/apis";
import axios from "../settings/axios";
import { useEffect } from "react";

export function useListCategory() {
  const { refetch: fetchListCategory, data: ListCategoryData } = useQuery({
    queryKey: ["list_category"],
    queryFn: () => {
      return axios.get(REQUEST_GET_CATEGORY);
    },
    enabled: false,
  });

  useEffect(() => {
    fetchListCategory();
  }, []);

  return {
    fetchListCategory,
    ListCategoryData,
  };
}
