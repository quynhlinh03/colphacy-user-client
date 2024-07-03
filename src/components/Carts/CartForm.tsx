import { Button, Flex, Text, Title, useMantineTheme } from "@mantine/core";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SelectedProductCardItem } from "../../types/Cart";
import { useNavigate } from "react-router-dom";
import { ORDER_MANAGEMENT } from "../../constants/routes";
interface CartFormProps {
  allProductCart: SelectedProductCardItem[] | undefined;
}
export const CartForm: FC<CartFormProps> = ({ allProductCart }) => {
  const { handleSubmit } = useForm();
  const getTotalPrice = () => {
    let sum = 0;
    allProductCart?.forEach((product) => {
      sum = sum + product.salePrice * product.quanity;
    });
    return sum;
  };
  const [totalPrice, setTotalPrice] = useState(getTotalPrice);
  useEffect(() => {
    setTotalPrice(getTotalPrice);
  }, [allProductCart]);
  const navigate = useNavigate();
  const onSubmit = () => {
    navigate(ORDER_MANAGEMENT, { state: { allProductCart, totalPrice } });
  };
  const theme = useMantineTheme();
  return (
    <div className="cart-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          direction={{ base: "column" }}
          gap={{ base: "xs" }}
          justify={{ sm: "center" }}
          w="22vw"
        >
          <Title order={4} align="center" color={theme.colors.munsellBlue[0]}>
            Tổng tiền tạm tính
          </Title>
          <Text size="lg" ta="center" fw={500}>
            {totalPrice.toLocaleString("vi-VN")} đ
          </Text>
          <Button
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1
                  ),
                }),
              },
            })}
            type="submit"
            disabled={allProductCart?.length === 0}
          >
            Mua hàng ({allProductCart?.length})
          </Button>
          <Text w="95%" ta="center" mx={"3%"}>
            Bằng việc tiến hành đặt mua hàng, bạn đồng ý với
            <a href="#1"> Điều khoản, dịch vụ</a>,
            <a href="#2"> Chính sách thu thập và xử lý thông tin </a>
            của nhà thuốc Colphacy
          </Text>
        </Flex>
      </form>
    </div>
  );
};
