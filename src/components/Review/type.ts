interface Review {
  productId: number;
  rating: number;
  content: string;
}
interface ReviewForm {
  id: number;
  name: string;
  image: string;
  onSuccesSubmitAdd: () => {};
}
interface ReviewItem {
  id: number;
  rating?: number;
  content: string;
  reviewerName: string;
  childReview?: ReviewItem[];
  createdTime: string;
}
interface ListReview {
  items: ReviewItem[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}
