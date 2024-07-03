import {FC, useEffect, useState} from "react";
import {
    Anchor,
    Button,
    Container,
    Divider,
    Flex,
    Image,
    Text,
    Title,
    useMantineTheme,
} from "@mantine/core";
import {IconChevronRight} from "@tabler/icons-react";
import {OrderHistoryItem} from "./type";
import {modals} from "@mantine/modals";
import {useLocation, useNavigate} from "react-router-dom";
import {useOrderHistoryDetail} from "../../hooks/useOrderHistory";
import OrderNull from "../../assets/images/order-null.png";
import CountDownTimer from "./CountDownTimer";

interface OrderHistoryTableProps {
    startIndex: number;
    sortBy:
        | "order_time"
        | "confirm_time"
        | "ship_time"
        | "deliver_time"
        | "cancel_time"
        | "total";
    order: "asc" | "desc";
    time: string;
    orders: OrderHistoryItem[] | undefined;
    status: string;
    changeStatusOrder: (data: { id: number; toStatus: string | null }) => void;
    handleconfirmOrder: (data: { id: number; toStatus: string | null }) => void;
}

const OrderHistoryTable: FC<OrderHistoryTableProps> = ({
                                                           orders,
                                                           changeStatusOrder,
                                                           handleconfirmOrder,
                                                       }) => {
    const [idOrder, setIdOrder] = useState();
    const {detailOrder, onSubmitRebuyOrder, fetchLink} = useOrderHistoryDetail(idOrder);
    const location = useLocation();
    const changeStatusModal = (id: number, toStatus: string) =>
        modals.openConfirmModal({
            title:
                toStatus != "CANCELLED" ? (
                    <b>Xác nhận đơn hàng</b>
                ) : (
                    <b>Hủy đơn hàng</b>
                ),
            children: "Bạn có chắc chắn muốn hủy đơn hàng",
            centered: true,
            confirmProps: {color: "red"},
            labels: {confirm: "Xác nhận", cancel: "Hủy"},
            onCancel: () => {
            },
            onConfirm: () => changeStatusOrder({id: id, toStatus: toStatus}),
        });
    const confirmDeliveredModal = (id: number, toStatus: string) =>
        modals.openConfirmModal({
            title:
                toStatus != "CANCELLED" ? (
                    <b>Xác nhận đã nhận hàng</b>
                ) : (
                    <b>Yêu cầu Trả hàng/ Hoàn tiền</b>
                ),
            children:
                toStatus != "CANCELLED" ? (
                    <div>Bạn có chắc chắn muốn xác nhận đã nhận đơn hàng</div>
                ) : (
                    <div>Bạn có chắc chắn muốn trả hàng/ hoàn tiền đơn hàng</div>
                ),
            centered: true,
            confirmProps: {color: "red"},
            labels: {confirm: "Xác nhận", cancel: "Hủy"},
            onCancel: () => {
            },
            onConfirm: () => handleconfirmOrder({id: id, toStatus: toStatus}),
        });

    const theme = useMantineTheme();
    const navigate = useNavigate();

    const formattedDate = (date: Date) =>
        new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    console.log(orders)
    const rows = (orders != undefined ? orders.items : []).map((element, index) => (
        <Flex direction={"column"} className="card-table" mb={10} p={10} key={index}>
            <Flex mt={10}>
                <Title order={4}>
                    Đơn hàng {formattedDate(new Date(element.orderTime)).slice(0, 10)}
                </Title>
                <Text px="lg">Giao hàng tận nơi</Text>
                <Text mx={20}>#{element.id}</Text>
                <Flex>
                    {element.status === "CANCELLED" && <Text c="red.6">Đã hủy</Text>}
                    {element.status === "TO_PAY" && <Text c="indigo.9">Đang xử lý</Text>}
                    {element.status == "DELIVERED" && <Text c="green.5">Đã giao</Text>}
                    {element.status == "SHIPPING" && (
                        <Text color="blue.5">Đang giao</Text>
                    )}
                    {element.status == "CONFIRMED" && (
                        <Text color="orange.9">Chờ vận chuyển</Text>
                    )}
                    {element.status == "PENDING" && (
                        <Text color="yellow.7">Chờ xác nhận</Text>
                    )}
                </Flex>
                <Flex ml="auto">
                    {element.status === "COMPLETED" && !element.reviewed && (
                        <Anchor>
                            <Title
                                onClick={() => {
                                    navigate(`${element.id}`);
                                }}
                                pt={2}
                                color={theme.colors.munsellBlue[0]}
                                order={4}
                            >
                                Đánh giá sản phẩm
                            </Title>
                        </Anchor>
                    )}
                    {element.status === "PENDING" && (
                        <Button
                            w={100}
                            color="red"
                            onClick={() => changeStatusModal(element.id, "")}
                        >
                            Hủy
                        </Button>
                    )}
                    {element.status === "RETURNED" && (
                        <Title
                            pt={2}
                            color={theme.colors.munsellBlue[0]}
                            order={5}
                        >
                            {element.resolveType === "PENDING" && "Đang chờ xử lý"}
                            {element.resolveType === "REFUSED" && "Yêu cầu bị từ chối"}
                            {element.resolveType === "RETURN" && "Trả hàng thành công"}
                            {element.resolveType === "REFUND" && "Hoàn tiền thành công"}
                        </Title>
                    )}
                </Flex>
            </Flex>
            <Divider my="sm"/>
            <Flex gap={"md"}>
                <Image
                    width="60px"
                    height="60px"
                    radius="lg"
                    fit="scale-down"
                    src={element.productImage}
                />
                <Text w="50%" pt={20}>
                    {element.productName}
                </Text>
                <Flex ml="auto">
                    <Title order={6} mr={30}>
                        {element.productPrice.toLocaleString("vi-VN")} đ
                    </Title>
                    <Text>x{element.productQuantity}</Text>
                </Flex>
            </Flex>
            <Flex>
                <Button
                    w="fit-content"
                    p={0}
                    mt="1em"
                    rightIcon={<IconChevronRight size="1rem" stroke={1.5}/>}
                    styles={(theme) => ({
                        root: {
                            background: theme.white,
                            color: theme.colors.munsellBlue[0],
                            ...theme.fn.hover({
                                color: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                                background: theme.white,
                            }),
                        },
                    })}
                    onClick={() => {
                        navigate(`${element.id}`);
                    }}
                >
                    Xem chi tiết
                </Button>
                <Flex mt={20} ml="auto">
                    <Text mt={1}>Thành tiền: </Text>
                    <Title ml="md" order={5}>
                        {element.total.toLocaleString("vi-VN")}đ
                    </Title>
                </Flex>
            </Flex>
            <Divider my="sm"/>
            {(element.status === "SHIPPING") && (
                <Flex justify="space-between" align="center">
                    <Text w="30rem">
                        Vui lòng chỉ nhấn Đã nhận hàng khi đơn hàng đã được giao đến bạn và
                        sản phẩm nhận được không có vẫn đề nào.
                    </Text>
                    <Flex py={10} gap="lg" justify="flex-end" align="center">
                        <Button
                            color="red"
                            onClick={() => {
                                confirmDeliveredModal(element.id, "COMPLETED");
                            }}
                        >
                            Đã nhận hàng
                        </Button>
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => confirmDeliveredModal(element.id, "CANCELLED")}
                        >
                            Yêu cầu Trả hàng/ Hoàn tiền
                        </Button>
                    </Flex>
                </Flex>
            )}
            {(element.status === "DELIVERED") && (
                <Flex justify="space-between" align="center">
                    <Text w="30rem">
                    </Text>
                    <Flex py={10} gap="lg" justify="flex-end" align="center">
                        <Button
                            variant="outline"
                            color="red"
                            onClick={() => confirmDeliveredModal(element.id, "CANCELLED")}
                        >
                            Yêu cầu Trả hàng/ Hoàn tiền
                        </Button>
                    </Flex>
                </Flex>
            )}
            {(element.status === "TO_PAY") && (
                <Flex justify="space-between" align="center">
                    <Flex gap="md">
                        <Text>
                            Vui lòng thanh toán sau:
                        </Text>
                        <CountDownTimer orderTime={new Date(element.orderTime)}/>
                    </Flex>
                    <Button
                        variant="filled"
                        color="red"
                        onClick={() => {
                            fetchLink(element.id)
                        }}
                    >
                        Thanh toán
                    </Button>
                </Flex>
            )}
            {(element.status === "CANCELLED") && (
                <Flex justify="space-between" align="center">
                    <Text w="30rem">
                        {element.cancelBy == "EMPLOYEE" && "Đã hủy bởi nhà thuốc"}
                        {element.cancelBy == "CUSTOMER" && "Đã hủy bởi bạn"}
                        {element.cancelBy == "UNPAID" && "Đã hủy do chưa thanh toán"}
                    </Text>
                    <Flex py={10} gap="lg" justify="flex-end" align="center">
                        <Button
                            ml="auto"
                            mb={12}
                            w={100}
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
                                setIdOrder(element.id);
                                const items = detailOrder.orderItems.map((item) => ({
                                    productId: item.product.id,
                                    quantity: item.quantity,
                                    unitId: item.unit.id,
                                }));
                                const data = {
                                    items: items,
                                };
                                onSubmitRebuyOrder(
                                    data,
                                    () => {
                                        navigate("/cart-management");
                                    },
                                    () => {
                                    }
                                );
                            }}
                        >
                            Mua lại
                        </Button>
                        {(element.paymentMethod == "ONLINE" && element.cancelBy !== "UNPAID") &&
                            <Text>
                                Đã được hoàn tiền
                            </Text>
                        }
                    </Flex>
                </Flex>
            )}
        </Flex>
    ));

    return (
        <>
            {orders && <>{rows}</>}
            {orders?.length === 0 && (
                <Container>
                    <Flex
                        p="2rem"
                        align="center"
                        justify="center"
                        gap="md"
                        direction="column"
                    >
                        <Image src={OrderNull} width={50}/>
                        Chưa có đơn hàng
                    </Flex>
                </Container>
            )}
        </>
    );
};

export default OrderHistoryTable;
