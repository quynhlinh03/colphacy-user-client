export type ProductCartItem = {
  id: number;
  name: string;
  image: string;
  salePrice: number;
  unitName: string;
  unitId: number;
};

export interface AllProductCardProps {
  id: number;
  productInfo: ProductCartItem;
  quantity: number;
}

export interface SelectedProductCardItem {
  productId: number;
  checked: boolean;
  key: number;
  quanity: number;
  salePrice: number;
  name: string;
  image: string;
  unitName: string;
  unitId: number;
}
