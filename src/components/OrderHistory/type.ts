export interface OrderHistoryItem {
  adminConfirmDeliver: string;
  adminConfirmDeliverTime: Date;
  cancelBy: string;
  cancelReturn: string;
  completeTime: Date;
  paid: boolean;
  payTime: Date;
  paymentMethod: string;
  requestReturnTime: string;
  resolveTime: string;
  resolveType: null;
  id: number;
  status: string;
  productId: number;
  productName: string;
  productPrice: number;
  productQuantity: number;
  productImage: string;
  orderTime: Date;
  shipTime: Date;
  confirmTime: Date;
  deliverTime: Date;
  cancelTime: Date;
  shippingFee: number;
  total: number;
  totalItems: number;
  reviewed: boolean;
}

export interface DetailOrderItem {
  id: number;
  receiver: {
    id: number;
    name: string;
    phone: string;
    address: {
      streetAddress: string;
      ward: string;
      district: string;
      province: string;
      latitude: number;
      longitude: number;
    };
    isPrimary: boolean;
  };
  paymentMethod: string;
  paid: boolean;
  orderTime: Date;
  confirmTime: Date;
  shipTime: Date;
  deliverTime: Date | undefined;
  cancelTime: Date | undefined;
  status: string;
  orderItems: [
    {
      product: {
        id: number;
        name: string;
        image: string;
      };
      unit: {
        id: number;
        name: string;
      };
      price: number;
      expirationDate: Date;
      quantity: number;
      reviewed: boolean;
    }
  ];
  branch: {
    id: number;
    address: {
      streetAddress: string;
      ward: string;
      district: string;
      province: string;
      latitude: number;
      longitude: number;
    };
    closingHour: string;
    openingHour: string;
    phone: string;
    status: string;
    employees: [];
  };
}

export interface ProductOrderItem {
  product: {
    id: number;
    name: string;
    image: string;
  };
  unit: {
    id: number;
    name: string;
  };
  price: number;
  expirationDate: Date;
  quantity: number;
}

export interface Order {
  branchId: string;
  customerId: string;
  orderTime: Date;
  items: {
    productId: string;
    quantity: number;
    unitId: string;
    salePrice: number;
  }[];
}

export interface OrderData {
  items: OrderHistoryItem[];
  numPages: number;
  offset: number;
  limit: number;
  totalItems: number;
}