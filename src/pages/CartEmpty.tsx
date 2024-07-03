import { Button, Flex, Image, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import emptyCart from "../assets/images/empty-cart.png";
// import emptyCart from "";

function CartEmpty() {
    const navigate = useNavigate()
    return (
        <Flex direction="column" align="center" gap={"xs"}>
            <img src={emptyCart} alt="Empty cart" width="150px"></img>
            <Title order={4}>Chưa có sản phẩm nào trong giỏ hàng</Title>
            <Text c="dimmed" w="60%" align="center">Cùng mua sắm hàng ngàn sản phẩm tại nhà thuốc Colphacy Phamacy nhé!</Text>
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
                onClick={()=>{
                    navigate("/")
                }}
            >
                Mua hàng
            </Button>
        </Flex>
    );
}

export default CartEmpty;