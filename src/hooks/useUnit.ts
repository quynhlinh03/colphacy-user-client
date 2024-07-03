import { useQuery } from "@tanstack/react-query";
import { REQUEST_GET_UNIT } from "../constants/apis";
import axios from "../settings/axios";

export function useListUnit() {
  const fetchListUnit = useQuery({
    queryKey: ["list_unit"],
    queryFn: () => {
      return axios.get(REQUEST_GET_UNIT);
    },
    enabled: false,
  });

  return {
    fetchListUnit,
  };
}
