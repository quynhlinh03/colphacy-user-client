export const REQUEST_AUTH_LOGIN_OTP = "/auth/employee/otp/validate";

export const REQUEST_GENERATE_OTP = "/auth/employee/otp/generate";

export const REQUEST_AUTH_LOGIN_PASSWORD = "/auth/customer/login";

export const REQUEST_AUTH_LOGOUT = "/auth/customer/logout";

export const REQUEST_CHANGE_PASSWORD = "/customers/change-password";

export const REQUEST_CART = "/carts";

export const REQUEST_PRODUCTCART_DELETE = (id: number) => `/carts/remove/${id}`;

export const REQUEST_PRODUCTCART_UPDATE = (id: number) => `/carts/update/${id}`;

export const REQUEST_GET_CATEGORY = "/categories/all";

export const REQUEST_GET_UNIT = "/units/all";

export const REQUEST_BEST_SELLERS = "/products/best-sellers";

export const REQUEST_PRODUCT_DETAIL = (id: number) =>
  `/products/customers/${id}`;

export const REQUEST_ADD_PRODUCT_CART = "/carts/add";

export const REQUEST_PROVINCES = "/location/provinces";

export const REQUEST_DISTRICTS = (id: number) =>
  `/location/districts?provinceId=${id}`;

export const REQUEST_WARDS = (id: number) => `/location/wards?districtId=${id}`;

export const REQUEST_RECEIVERS_ADDRESS = "/receivers";

export const REQUEST_DETAIL_RECEIVERS_ADDRESS = (id: number) =>
  `/receivers/${id}`;

export const REQUEST_PRODUCT_LIST = "/products/customers/";

export const REQUEST_CREATE_ORDER = "/orders/purchase";

export const REQUEST_REVIEW = `/reviews`;

export const REQUEST_LIST_REVIEW = (id: number) => `/reviews/product/${id}`;

export const REQUEST_USER_PROFILE = `/customers/profile`;

export const REQUEST_NEAREST_BRANCH = `/branches/nearest`;

export const REQUEST_BRANCH_DETAIL = (id: number) => `branches/for-all/${id}`;

export const REQUEST_BRANCHES_PROVINCES = "/branches/provinces";

export const REQUEST_BRANCHES_DISTRICTS = (slug: string) =>
  `/branches/provinces/districts/${slug}`;
export const REQUEST_BRANCHES_SEARCH_KEY = `/branches/search`;

export const REQUEST_BRANCHES = `/branches/for-all`;
