export enum OrderStatus {
  null = "Tất cả",
  TO_PAY = "Chờ thanh toán",
  PENDING = 'Chờ xác nhận',
  CONFIRMED = 'Chờ vận chuyển', 
  SHIPPING = 'Đang giao',
  DELIVERED = 'Đã giao',
  CANCELLED = 'Đã hủy',
  RETURNED = "Trả hàng/Hoàn tiền",
}

export enum OrderTimeline {
  ORDER_TIME = 'Thời gian đặt',
  CONFIRM_TIME = 'Thời gian xác nhận',
  SHIP_TIME = 'Thời gian giao',
  DELIVER_TIME = 'Thời gian nhận',
  CANCEL_TIME = 'Thời gian hủy',
}

