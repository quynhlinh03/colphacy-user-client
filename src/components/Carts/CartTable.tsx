import { FC, useEffect, useState } from "react";
import { Image, NumberInput, Checkbox, Table } from "@mantine/core";
import { IconTrashX } from "@tabler/icons-react";
import { useListState } from "@mantine/hooks";
import { AllProductCardProps, SelectedProductCardItem } from "../../types/Cart";
import useCart from "../../hooks/useCart";
import { ErrorObject } from "../../types/error";
import { handleGlobalException } from "../../utils/error";
import { deleteModal } from "../../utils/deleteModal";
interface CartTableProps {
  setProducts: (data: SelectedProductCardItem[]) => void;
  preCheckList: SelectedProductCardItem[] | undefined;
}
interface CheckItem {
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
const CartTable: FC<CartTableProps> = ({ setProducts, preCheckList }) => {
  const { fetchCart, onSubmitDeleteProductCart, onSubmitUpdateProductCart } =
    useCart();
  const [allProducts, setAllProducts] = useState<AllProductCardProps[]>();
  const [loadPage, setLoadPage] = useState(false);
  const [checkList, setCheckList] = useListState<CheckItem>();
  useEffect(() => {
    async function fetchData() {
      const data = await fetchCart();
      if (data.isSuccess) {
        const result = data.data.data;
        setAllProducts(result);
        const checkedProductList = result.map(
          (product: AllProductCardProps) => ({
            key: product.id,
            checked: true,
            quanity: product.quantity,
            productId: product.productInfo.id,
            salePrice: product.productInfo.salePrice,
            name: product.productInfo.name,
            unitName: product.productInfo.unitName,
            unitId: product.productInfo.unitId,
            image: product.productInfo.image,
          })
        ) as SelectedProductCardItem[];
        if (preCheckList) {
          setCheckList.setState(
            preCheckList.filter((item) =>
              checkedProductList.some(
                (checkedItem) => checkedItem.key === item.key
              )
            )
          );
        } else {
          setCheckList.setState(checkedProductList);
        }
      } else if (data.isError) {
        const error = data.error;
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => { });
      }
    }
    fetchData();
  }, [loadPage]);
  useEffect(() => {
    setProducts(checkList);
  }, [setCheckList]);
  const handleSelectAll = () => {
    setCheckList.setState((current) =>
      current.map((value) => ({ ...value, checked: !allChecked }))
    );
  };
  const allChecked =
    checkList.every((value) => value.checked) && checkList.length !== 0;
  const indeterminate = checkList.some((value) => value.checked) && !allChecked;
  const rows = allProducts?.map((element, index) => (
    <tr key={element.id}>
      <td className="td-group" width="100%">
        <Checkbox
          size="xs"
          my="auto"
          checked={checkList[index].checked}
          key={element.id}
          onChange={(event) => {
            setCheckList.setItemProp(
              index,
              "checked",
              event.currentTarget.checked
            );
          }}
        />
        <Image
          width="100px"
          height="100px"
          radius="lg"
          fit="scale-down"
          src={element.productInfo.image}
        />
        <span>{element.productInfo.name}</span>
      </td>
      <td>{element.productInfo.salePrice.toLocaleString("vi-VN")} đ</td>
      <td>
        <NumberInput
          value={checkList[index].quanity}
          radius="xs"
          min={1}
          max={100}
          onChange={(val) => {
            if (Number(val) > 0) {
              setCheckList.setItem(index, {
                ...checkList[index],
                key: checkList[index].key,
                checked: checkList[index].checked,
                quanity: Number(val),
                salePrice: checkList[index].salePrice,
              });
              onSubmitUpdateProductCart({ id: element.id, quantity: Number(val) });
            } 
          }}
          styles={() => ({
            root: {
              width: "5em",
              height: "2em",
            },
          })}
        />

      </td>
      <td>{element.productInfo.unitName}</td>
      <td align="right">
        <IconTrashX
          className="delete-button"
          strokeWidth="1.8"
          size="22px"
          onClick={() => {
            deleteModal("", "", () => {
              handleDeleteCart({ id: element.id as number });
            });
          }}
        />
      </td>
    </tr>
  ));
  const handleDeleteCart = (data: { id: number }) => {
    onSubmitDeleteProductCart(data, () => {
      setLoadPage(!loadPage);
    });
  };
  return (
    allProducts && allProducts?.length > 0 && (<Table className="card-table" mr="1em" w="70%">
      <thead>
        <tr>
          <th>
            <Checkbox
              size="xs"
              label={`Chọn tất cả (${allProducts?.length})`}
              onChange={handleSelectAll}
              checked={allChecked}
              indeterminate={indeterminate}
            />
          </th>
          <th>Giá thành</th>
          <th>Số lượng</th>
          <th colSpan={2}>Đơn vị</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>)

  );
};

export default CartTable;
