import {
  REQUEST_NEAREST_BRANCH,
  REQUEST_BRANCH_DETAIL,
  REQUEST_BRANCHES_SEARCH_KEY,
  REQUEST_BRANCHES,
  REQUEST_BRANCHES_DISTRICTS,
  REQUEST_BRANCHES_PROVINCES,
} from "./../constants/apis";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
export function useBranch(
  nearest: {
    longitude: number;
    latitude: number;
    offset: number;
    limit: number;
  },
  id: number
) {
  const buildParams = () => {
    const params: Record<string, any> = {};
    if (nearest.longitude) {
      params.longitude = nearest.longitude;
    }
    if (nearest.latitude) {
      params.latitude = nearest.latitude;
    }
    if (nearest.limit) {
      params.limit = nearest.limit;
    }
    return params;
  };
  const fetchNearestBranchData = async ({ pageParam = 0 }) => {
    const params = buildParams();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_NEAREST_BRANCH, {
      params: params,
    });
    return res;
  };
  const {
    data: dataNearest,
    error: errorNearest,
    fetchNextPage: fetchNextPageNearest,
    hasNextPage: hasNextPageNearest,
    isFetchingNextPage: isFetchingNextPageNearest,
    status: statusNearest,
    refetch: refetchNearest,
  } = useInfiniteQuery({
    queryKey: ["nearest_branchs"],
    queryFn: fetchNearestBranchData,
    enabled: false,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.data.offset + lastPage.data.items.length;
      if (nextOffset === lastPage.data.totalItems) return undefined;
      else {
        return nextOffset;
      }
    },
  });

  const fetchDetailBranch = useQuery({
    queryKey: ["get-detail-branch"],
    queryFn: () => {
      return axios.get(REQUEST_BRANCH_DETAIL(id));
    },
    enabled: false,
  });

  return {
    dataNearest,
    errorNearest,
    fetchNextPageNearest,
    hasNextPageNearest,
    isFetchingNextPageNearest,
    statusNearest,
    refetchNearest,
    fetchDetailBranch,
  };
}

export function useFindBranch(
  search: { offset: number; limit: number; keyword: string },
  filter?: {
    offset: number;
    limit: number;
    province?: string;
    district?: string;
  },
  provinceSlug?: string
) {
  const buildParamsSearch = () => {
    const params: Record<string, any> = {};
    if (search.keyword) {
      params.keyword = search.keyword;
    }
    if (search.limit) {
      params.limit = search.limit;
    }

    return params;
  };
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.province) {
      params.province = filter.province;
    }

    if (filter.district) {
      params.district = filter.district;
    }

    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const fetchBranchProvinces = useQuery({
    queryKey: ["branch_provinces"],
    queryFn: () => axios.get(REQUEST_BRANCHES_PROVINCES),
    enabled: false,
  });
  const fetchBranchDistricts = useQuery({
    queryKey: ["branch_districts"],
    queryFn: () => axios.get(REQUEST_BRANCHES_DISTRICTS(provinceSlug)),
    enabled: false,
  });
  const fetchBranchData = async ({ pageParam = 0 }) => {
    const params = buildParams();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_BRANCHES, {
      params: params,
    });
    return res;
  };
  const {
    data: dataFilter,
    error: errorFilter,
    fetchNextPage: fetchNextPageFilter,
    hasNextPage: hasNextPageFilter,
    isFetchingNextPage: isFetchingNextPageFilter,
    status: statusFilter,
    refetch: refetchFilter,
  } = useInfiniteQuery({
    queryKey: ["filter_branchs"],
    queryFn: fetchBranchData,
    enabled: false,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.data.offset + lastPage.data.items.length;
      if (nextOffset === lastPage.data.totalItems) return undefined;
      else {
        return nextOffset;
      }
    },
  });
  const fetchBranchSearchData = async ({ pageParam = 0 }) => {
    const params = buildParamsSearch();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_BRANCHES_SEARCH_KEY, {
      params: params,
    });
    return res;
  };
  const {
    data: dataSearch,
    error: errorSearch,
    fetchNextPage: fetchNextPageSearch,
    hasNextPage: hasNextPageSearch,
    isFetchingNextPage: isFetchingNextPageSearch,
    status: statusSearch,
    refetch: refetchSearch,
  } = useInfiniteQuery({
    queryKey: ["search_branchs"],
    queryFn: fetchBranchSearchData,
    enabled: false,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.data.offset + lastPage.data.items.length;
      if (nextOffset === lastPage.data.totalItems) return undefined;
      else {
        return nextOffset;
      }
    },
  });
  return {
    dataFilter,
    errorFilter,
    fetchNextPageFilter,
    hasNextPageFilter,
    isFetchingNextPageFilter,
    statusFilter,
    refetchFilter,
    dataSearch,
    errorSearch,
    fetchNextPageSearch,
    hasNextPageSearch,
    isFetchingNextPageSearch,
    statusSearch,
    refetchSearch,
    fetchBranchProvinces,
    fetchBranchDistricts,
  };
}
