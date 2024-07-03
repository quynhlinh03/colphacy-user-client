import {useRef, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {OrderStatus} from "../enums/Order";
import useOrderHistory, {useOrderHistoryDetail} from "../hooks/useOrderHistory";
import {Anchor, Button, Container, Divider, Flex, Image, Tabs, Text, Title, useMantineTheme} from "@mantine/core";
import {IconChevronRight, IconSearch} from "@tabler/icons-react";
import {modals} from "@mantine/modals";
import OrderHistoryTable from "../components/OrderHistory/OrderHistoryTable.tsx";
import OrderNull from "../assets/images/order-null.png"
const LIMIT = 10;

function OrderHistory() {
    const params = useParams();
    const [queryParameters] = useSearchParams();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [keyword, setKeyWord] = useState<string>("");
    const [status, setStatus] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [idOrder, setIdOrder] = useState();
    const theme = useMantineTheme();
    const { OrderData, handleChangeStatusOrder, handleconfirmOrder } = useOrderHistory((currentPage - 1) * LIMIT, keyword, startDate, endDate, status);
    const [active, setActive] = useState(1);
    const { detailOrder, onSubmitRebuyOrder } = useOrderHistoryDetail(idOrder);
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
            confirmProps: { color: "red" },
            labels: { confirm: "Xác nhận", cancel: "Hủy" },
            onCancel: () => { },
            onConfirm: () => handleChangeStatusOrder({ id: id, toStatus: toStatus }),
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
            confirmProps: { color: "red" },
            labels: { confirm: "Xác nhận", cancel: "Hủy" },
            onCancel: () => { },
            onConfirm: () => handleconfirmOrder({ id: id, toStatus: toStatus }),
        });


    const onSearch = (searchValue: string) => {
        queryParameters.set('keyword', searchValue);
        navigate(`search/?${decodeURIComponent(queryParameters.toString())}`);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value
        setKeyWord(keyword);
        setCurrentPage(1);
    };
    const formattedDate = (date: Date) =>
        new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    const rows = OrderData?.items.map((element, index) => (
        <Flex direction={"column"} className="card-table" mb={10} p={10} key={index}>
            <Flex mt={10}>
                <Title order={4}>
                    Đơn hàng {formattedDate(new Date(element.orderTime)).slice(0, 10)}
                </Title>
                <Text px="lg">Giao hàng tận nơi</Text>
                <Text mx={20}>#{element.id}</Text>
                <Flex>
                    {element.status === "CANCELLED" && <Text c="red.6">Đã hủy</Text>}
                    {element.status == "COMPLETED" && <Text c="indigo.9">Hoàn tất</Text>}
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
                    {element.status === "CANCELLED" && (
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
                                    () => { }
                                );
                            }}
                        >
                            Mua lại
                        </Button>
                    )}
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
                </Flex>
            </Flex>
            <Divider my="sm" />
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
                    rightIcon={<IconChevronRight size="1rem" stroke={1.5} />}
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
            <Divider my="sm" />
            {(element.status === "SHIPPING" || element.status === "DELIVERED") && (
                <Flex justify="space-between" align="center" gap="lg">
                    <Text>
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
        </Flex>
    ));
    return (
        <>
            <Flex p={5}>
                <Title order={4} pt="1em">Đơn hàng của tôi</Title>
                <Container className="search" mr={0}>
                    <input
                        ref={inputRef}
                        value={keyword}
                        placeholder="Tìm kiếm theo tên sản phẩm"
                        spellCheck={false}
                        onChange={handleChange}
                    />
                    <button
                        className="search-btn"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        <IconSearch size="1.3rem"></IconSearch>
                    </button>
                </Container>
            </Flex>
            <Tabs defaultValue="null" onTabChange={setStatus}>
                <Tabs.List grow className="card-table">
                    {Object.keys(OrderStatus).map((item) => (
                        <Tabs.Tab key={item} value={item} onClick={()=>{setCurrentPage(1)}}>
                            {OrderStatus[item as keyof typeof OrderStatus]}
                        </Tabs.Tab>
                    ))}
                </Tabs.List>
                {Object.keys(OrderStatus).map((item) => (
                    <Tabs.Panel key={item} value={item} pt="xs">
                        <OrderHistoryTable
                            handleconfirmOrder = {handleconfirmOrder}
                            startIndex={0}
                            sortBy={"order_time"}
                            order={"asc"}
                            time={"Thời gian đặt"}
                            orders={OrderData}
                            status={item}
                            changeStatusOrder={handleChangeStatusOrder}
                        />
                        {OrderData?.items.length === 0 && (
                            <Container>
                                <Flex
                                    p="2rem"
                                    align="center"
                                    justify="center"
                                    gap="md"
                                    direction="column"
                                >
                                    <Image src={OrderNull} width={50} />
                                    Không có đơn hàng ở trạng thái này
                                </Flex>
                            </Container>
                        )}
                    </Tabs.Panel>
                ))}
            </Tabs>
        </>
    );
}

export default OrderHistory;