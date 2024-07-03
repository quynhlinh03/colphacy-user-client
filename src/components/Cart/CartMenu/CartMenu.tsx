import { Button, Flex, Indicator, Menu } from "@mantine/core";
import { IconShoppingCartFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import CartItem from "../CartItem/CartItem";
import { useNavigate } from "react-router-dom";
import useCart from "../../../hooks/useCart";
import useAuth from "../../../hooks/useAuth";

export default function CartMenu() {
  const { fetchCart, cartData, onSubmitDeleteProductCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);
  const [prevCartData, setPrevCartData] = useState<ProductCartProps[] | []>([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    if (!isPageLoaded) {
      setIsPageLoaded(true);
    } else if (prevCartData && cartData?.data !== prevCartData) {
      setOpened(true);
    }
    if (!isAuthenticated) {
      setPrevCartData([]);
    } else {
      setPrevCartData(cartData?.data);
    }
  }, [cartData?.data, isAuthenticated, isPageLoaded]);

  const handleDeleteCart = async (data: { id: number }) => {
    await onSubmitDeleteProductCart(data, () => {
      fetchCart();
    });
    setOpened(true);
  };

  return (
    <>
      <Menu opened={opened} onChange={setOpened} shadow="md">
        <Menu.Target>
          <Indicator
            inline
            label={prevCartData?.length}
            color="red"
            size={20}
            disabled={prevCartData?.length ? false : true}
          >
            <Button
              className="login-button"
              leftIcon={<IconShoppingCartFilled size="15px" />}
              styles={(theme) => ({
                root: {
                  backgroundColor: theme.colors.munsellBlue[0],
                },
              })}
              onClick={() => {
                if (isAuthenticated) fetchCart();
              }}
            >
              Giỏ hàng
            </Button>
          </Indicator>
        </Menu.Target>

        <Menu.Dropdown className="menu-dropdown-cart">
          {prevCartData?.length ? (
            prevCartData?.map((item, index) => {
              return (
                <Menu.Item key={index} className="menu-item">
                  <CartItem
                    name={item.productInfo.name}
                    price={item.productInfo.salePrice}
                    unit={item.productInfo.unitName}
                    images={item.productInfo.image}
                    quantity={item.quantity}
                    handleDeleteProductCart={() => {
                      handleDeleteCart({ id: item.id as number });
                    }}
                  />
                </Menu.Item>
              );
            })
          ) : (
            <p className="text-product-cart">
              Chưa có sản phẩm được thêm vào giỏ hàng
            </p>
          )}
          <>
            {prevCartData?.length ? (
              <Flex justify="flex-end" align="center">
                <Button
                  m={10}
                  py={5}
                  mb={10}
                  radius="xl"
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
                  onClick={() => {
                    navigate("/cart-management");
                    setOpened(false);
                  }}
                >
                  Xem giỏ hàng
                </Button>
              </Flex>
            ) : (
              <Flex justify="flex-end" align="center">
                <Button
                  m={10}
                  py={5}
                  mb={10}
                  radius="xl"
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
                  onClick={() => {
                    navigate("/");
                    setOpened(false);
                  }}
                >
                  Mua hàng
                </Button>
              </Flex>
            )}
          </>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
