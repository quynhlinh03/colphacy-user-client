import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { REQUEST_LIST_REVIEW, REQUEST_REVIEW } from "../constants/apis";
export function useReview() {
  const handleAddReview = useMutation({
    mutationKey: ["add-review"],
    mutationFn: (data) => {
      return axios.post(REQUEST_REVIEW, data);
    },
  });
  const onSubmitAddReviewForm = (
    data: Review,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddReview.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  return {
    onSubmitAddReviewForm,
    handleAddReview,
  };
}

export function useListReview(review: {
  offset: number;
  limit: number;
}, id: number) {
  const buildParams = () => {
    const params: Record<string, any> = {};
    if (review.limit) {
      params.limit = review.limit;
    }
    return params;
  };

  const fetchListReview = async ({ pageParam = 0 }) => {
    const params = buildParams();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_LIST_REVIEW(id), {
      params: params,
    });
    return res;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["list_review"],
    queryFn: fetchListReview,
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
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  };
}
