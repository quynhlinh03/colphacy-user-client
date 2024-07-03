import { SelectedProductCardItem } from "../types/Cart";

export function formatNumberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function getNameById(id: number, category: Category[]) {
  let categoryItem = category.find((item) => item.id === id);
  return categoryItem?.name;
}

export function findName(
  id: number,
  data: Record<any, any>[],
  idKey: string,
  nameKey: string
) {
  for (let i = 0; i < data.length; i++) {
    if (data[i][idKey] === id) {
      return data[i][nameKey];
    }
  }
  return "ProvinceID not found";
}

export function findId(
  name: string,
  data: Record<any, any>[],
  idKey: string,
  nameKey: string
) {
  const record = data.find((item) => item[nameKey] === name);
  return record[idKey];
}

export function formatDataWards(data: { WardName: string }[]) {
  return data.map((item) => ({
    value: item.WardName,
    label: item.WardName,
  }));
}

export function formatData(
  data: Record<string, string>[],
  idKey: string,
  nameKey: string
) {
  return data.map((item) => ({
    value: item[idKey],
    label: item[nameKey],
  }));
}
export function getProductsInfo(allProducts: SelectedProductCardItem[]) {
  return allProducts.map((product) => ({
    productId: product.productId,
    quantity: product.quanity,
    unitId: product.unitId,
  }));
}