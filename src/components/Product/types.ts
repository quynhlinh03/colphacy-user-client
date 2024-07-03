interface ProductUnitProps {
  unitId: number;
  ratio: number;
  salePrice: number;
  importPrice: number;
  defaultUnit: boolean;
}
interface Ingredients {
  name: string;
  amount: number;
}
interface Category {
  id: number;
  name: string;
}
interface ProductDetailProps {
  id: number;
  name: string;
  packing: string;
  category: Category;
  manufacturer: string;
  brandOrigin: string;
  indications: string;
  shortDescription: string;
  fullDescription: string;
  registrationNumber: string;
  ingredients: Ingredients[];
  uses: string;
  usage: string;
  sideEffects: string;
  notes: string;
  storage: string;
  status: string;
  productUnits: ProductUnitProps[];
  images: [];
}

interface ProductItemProps {
  id: number;
  name: string;
  price: number;
  images: string;
  unit: string;
  unitId: number;
}
interface AddProductCartProps {
  productId: number;
  quantity: number;
  unitId: number;
}

interface ProductCartProps {
  id: number;
  quantity: number;
  productInfo: {
    id: number;
    name: string;
    salePrice: number;
    unitId: number;
    unitName: string;
    image: string;
  };
}

interface ProductListProp {
  items: BestSellersList[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}

interface BestSellersList {
  id: number;
  name: string;
  salePrice: number;
  unitName: string;
  unitId: number;
  image: string;
}
