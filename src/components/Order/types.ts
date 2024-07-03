interface Receivers {
  id: number;
  name: string;
  phone: number;
  address: {
    streetAddress: string;
    ward: string;
    district: string;
    province: string;
    latitude: number;
    longitude: number;
  };
  isPrimary: boolean;
}
interface OrderItem {
  productId: number;
  quantity: number;
  unitId: number;
}
interface Orders {
  receiverId: number;
  items: OrderItem[];
  note: string;
  paymentMethod: string;
}
