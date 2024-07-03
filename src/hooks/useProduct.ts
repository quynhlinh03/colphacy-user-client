import { useQuery } from '@tanstack/react-query';
import {
  REQUEST_BEST_SELLERS,
  REQUEST_PRODUCT_DETAIL,
  REQUEST_PRODUCT_LIST,
} from '../constants/apis';
import axios from '../settings/axios';

export function useProduct() {
  const fetchBestSellers = useQuery({
    queryKey: ['list_product_best_sellers'],
    queryFn: () => {
      return axios.get(REQUEST_BEST_SELLERS);
    },
    enabled: false,
  });

  return {
    fetchBestSellers,
  };
}

export function useProductList(filter: {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: string;
  offset?: number;
  limit?: number;
  categoryIds?: number;
  sortBy: string;
}) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.keyword) {
      params.keyword = filter.keyword;
    }

    if (filter.minPrice) {
      params.minPrice = filter.minPrice;
    }

    if (filter.maxPrice) {
      params.maxPrice = filter.maxPrice;
    }

    if (filter.order) {
      params.order = filter.order;
    }

    if (filter.offset) {
      params.offset = filter.offset;
    }

    if (filter.limit) {
      params.limit = filter.limit;
    }

    if (filter.categoryIds) {
      params.categoryIds = filter.categoryIds;
    }

    if (filter.sortBy) {
      params.sortBy = filter.sortBy;
    }

    return params;
  };
  const fetchProductList = useQuery({
    queryKey: ['product_list'],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_PRODUCT_LIST, {
        params: params,
      });
    },
    enabled: false,
  });

  return {
    fetchProductList,
  };
}

export function useDetailProduct(id: number) {
  const fetchDetailProduct = useQuery({
    queryKey: ['product_detail'],
    queryFn: () => {
      return axios.get(REQUEST_PRODUCT_DETAIL(id));
    },
  });

  return {
    fetchDetailProduct,
  };
}
