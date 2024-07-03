import {
  Anchor,
  Button,
  Divider,
  Flex,
  Grid,
  Image,
  Modal,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import useOrderHistory, {
  useOrderHistoryDetail,
} from '../hooks/useOrderHistory';
import { DetailOrderItem } from '../components/OrderHistory/type';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { handleGlobalException } from '../utils/error';
import {
  IconBuildingWarehouse,
  IconChevronLeft,
  IconMapPinFilled,
} from '@tabler/icons-react';
import { IconUser } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { ReviewForm } from '../components/Review/ReviewForm/ReviewForm';
import { modals } from '@mantine/modals';
import Cod from "../assets/images/cod.png";
import Vnpay from "../assets/images/vnpay.png";
import CountDownTimer from '../components/OrderHistory/CountDownTimer';
interface ReviewProduct {
  id: number;
  name: string;
  image: string;
}

const OrderHistoryDetail: React.FC = () => {
  const formattedDate = (date) =>
    new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  const params = useParams();
  const { handleChangeStatusOrder, handleconfirmOrder } = useOrderHistory(
    1,
    '',
    '',
    '',
    '',
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [productReview, setProductReview] = useState<ReviewProduct>();
  const idOrder = Number(params.id);
  const [detailOrder, setDetailOrder] = useState<DetailOrderItem>();
  const { fetchDetailOrder, onSubmitRebuyOrder, fetchLink } =
    useOrderHistoryDetail(idOrder);
  const navigate = useNavigate();

  async function fetchDetailBranch() {
    const data = await fetchDetailOrder.refetch();
    if (data.isSuccess) {
      setDetailOrder(data.data.data);
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => { });
    }
  }
  useEffect(() => {
    if (idOrder) {
      fetchDetailBranch();
    }
  }, []);
  const onSuccesSubmitAdd = () => {
    close;
  };
  const changeStatusModal = () =>
    modals.openConfirmModal({
      title: <b>Hủy đơn hàng</b>,
      children: 'Bạn có chắc chắn muốn hủy đơn hàng',
      centered: true,
      confirmProps: { color: 'red' },
      labels: { confirm: 'Xác nhận', cancel: 'Hủy' },
      onCancel: () => { },
      onConfirm: () => {
        handleChangeStatusOrder({ id: idOrder, toStatus: 'CANCELLED' });
        navigate(0);
      },
    });
  const confirmDeliveredModal = (toStatus: string) =>
    modals.openConfirmModal({
      title:
        toStatus != 'CANCELLED' ? (
          <b>Xác nhận đã nhận hàng</b>
        ) : (
          <b>Yêu cầu Trả hàng/ Hoàn tiền</b>
        ),
      children:
        toStatus != 'CANCELLED' ? (
          <div>Bạn có chắc chắn muốn xác nhận đã nhận đơn hàng</div>
        ) : (
          <div>Bạn có chắc chắn muốn trả hàng/ hoàn tiền đơn hàng</div>
        ),
      centered: true,
      confirmProps: { color: 'red' },
      labels: { confirm: 'Xác nhận', cancel: 'Hủy' },
      onCancel: () => { },
      onConfirm: () => {
        handleconfirmOrder({ id: idOrder, toStatus: toStatus });
        navigate(0);
      },
    });
  const rows = (detailOrder?.orderItems ? detailOrder.orderItems : []).map(
    (order) => (
      <Flex mt={20}>
        <Image
          width="60px"
          height="60px"
          radius="lg"
          fit="scale-down"
          src={order.product.image}
        />
        <Text w="50%" p={3}>
          {order.product.name}
        </Text>
        <Flex ml="auto" p={3}>
          <Title order={6} mr={30}>
            {order.price.toLocaleString('vi-VN')} đ
          </Title>
          <Text>x{order.quantity}</Text>
        </Flex>
        {detailOrder.status == 'DELIVERED' && !order.reviewed && (
          <Button
            ml="auto"
            w={100}
            styles={(theme) => ({
              root: {
                backgroundColor: theme.colors.munsellBlue[0],
                ...theme.fn.hover({
                  backgroundColor: theme.fn.darken(
                    theme.colors.munsellBlue[0],
                    0.1,
                  ),
                }),
              },
            })}
            onClick={() => {
              setProductReview(order.product);
              open();
            }}
          >
            Đánh giá
          </Button>
        )}
      </Flex>
    ),
  );
  return (
    detailOrder && (
      <>
        <Paper className="card-table">
          <Flex p={10} pt={15}>
            <Flex mr="sm" align="center">
              <IconChevronLeft
                onClick={() => {
                  navigate("/personal/my-order");
                }}
              />
            </Flex>
            <Title order={3}>
              Đơn hàng{' '}
              {formattedDate(new Date(detailOrder.orderTime)).slice(0, 10)}
            </Title>
            <Text px="lg" mt="0.5em">
              Giao hàng tận nơi
            </Text>
            <Text mx={20} mt="0.5em">
              #{detailOrder.id}
            </Text>
            <Flex mt="0.5em">
              {detailOrder.status === 'CANCELLED' && (
                <Text c="red.6">Đã hủy</Text>
              )}
              {detailOrder.status == 'DELIVERED' && (
                <Text c="green.5">Đã giao</Text>
              )}
              {detailOrder.status == 'COMPLETED' && (
                <Text c="indigo.9">Hoàn tất</Text>
              )}
              {detailOrder.status == 'SHIPPING' && (
                <Text color="blue.5">Đang giao</Text>
              )}
              {detailOrder.status == 'CONFIRMED' && (
                <Text color="orange.9">Chờ vận chuyển</Text>
              )}
              {detailOrder.status == 'PENDING' && (
                <Text color="yellow.7">Chờ xác nhận</Text>
              )}
            </Flex>
            {detailOrder.status == 'CANCELLED' && (
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
                        0.1,
                      ),
                    }),
                  },
                })}
                onClick={() => {
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
                      navigate('/cart-management');
                    },
                    () => { },
                  );
                }}
              >
                Mua lại
              </Button>
            )}
            {detailOrder.status === 'PENDING' && (
              <Button
                w={100}
                color="red"
                ml="auto"
                onClick={() => {
                  changeStatusModal();
                }}
              >
                Hủy
              </Button>
            )}
          </Flex>
          <Divider my="sm" />
          <Grid p={10}>
            <Grid.Col span={3}>
              <Flex mb={10}>
                <IconUser size={20} className="order-icon" />
                <Flex direction="column">
                  <Text>Thông tin cá nhân</Text>
                  {detailOrder.receiver.name}
                  <br />
                  {detailOrder.receiver.phone}
                </Flex>
              </Flex>
            </Grid.Col>

            {(detailOrder.receiver.address.streetAddress !==
              detailOrder.branch.streetAddress ||
              detailOrder.receiver.address.ward !== detailOrder.branch.ward ||
              detailOrder.receiver.address.district !==
              detailOrder.branch.district ||
              detailOrder.receiver.address.province !==
              detailOrder.branch.province) && (
                <Grid.Col span={5}>
                  <Flex mb={10}>
                    <IconMapPinFilled size={20} className="order-icon" />
                    <Flex direction="column" ml="md">
                      <Text>Địa chỉ nhận hàng</Text>
                      {detailOrder.receiver.address.streetAddress +
                        ', ' +
                        detailOrder.receiver.address.ward +
                        ', ' +
                        detailOrder.receiver.address.district +
                        ', ' +
                        detailOrder.receiver.address.province}
                    </Flex>
                  </Flex>
                </Grid.Col>
              )}

            <Grid.Col span={4} ml="auto">
              <Flex mb={10}>
                <IconBuildingWarehouse size={30} className="order-icon" />
                <Flex direction="column" ml="md">
                  <Text>Nhà thuốc xử lý đơn</Text>
                  {detailOrder.branch.streetAddress +
                    ', ' +
                    detailOrder.branch.ward +
                    ', ' +
                    detailOrder.branch.district +
                    ', ' +
                    detailOrder.branch.province}
                </Flex>
              </Flex>
            </Grid.Col>
          </Grid>
          <Divider my="sm" />
          <Flex p={10} direction="column" justify="space-between">
            <Flex>
              <Title order={5}>
                Phương thức thanh toán
              </Title>
              <Text ml="auto">{detailOrder.paid ? "Đã thanh toán" : "Chưa thanh toán"}</Text>
            </Flex>
            <Flex justify="space-between">
              {detailOrder.paymentMethod === "ON_DELIVERY" && <>
                <Image src={Cod} width={50} />
                <Text>Thanh toán tiền mặt khi nhận hàng</Text>
              </>}
              {detailOrder.paymentMethod === "ONLINE" &&
                <Flex align="center" gap="md">
                  <Image src={Vnpay} width={50} />
                  <Text>Thanh toán bằng thẻ ATM nội địa (Qua VNPay)</Text>
                </Flex>
              }
              {!detailOrder.paid && detailOrder.paymentMethod === "ONLINE" &&
                <Flex align="center" gap="md">
                  <Flex gap="md">
                    <Text>
                      Vui lòng thanh toán sau:
                    </Text>
                    <CountDownTimer orderTime={new Date(detailOrder.orderTime)} />
                  </Flex>
                  <Button
                    variant="filled"
                    color="red"
                    onClick={() => {
                      fetchLink(detailOrder.id)
                    }}
                  >
                    Thanh toán
                  </Button>
                </Flex>
              }
            </Flex>
          </Flex>
        </Paper>
        <Flex direction={'column'} className="card-table" mt={30} p={10}>
          <Title order={3}>Danh sách sản phẩm</Title>
          <Flex direction="column" mt={10}>
            {rows}
          </Flex>
        </Flex>
        {(detailOrder.status === "SHIPPING") && (
          <Flex
            className="card-table"
            mt={20}
            p={15}
            justify="space-between"
            align="center"
            gap="lg"
          >
            <Text>
              Vui lòng chỉ nhấn Đã nhận hàng khi đơn hàng đã được giao đến bạn
              và sản phẩm nhận được không có vẫn đề nào.
            </Text>
            <Flex py={10} gap="lg" justify="flex-end" align="center">
              <Button
                color="red"
                onClick={() => confirmDeliveredModal('DELIVERED')}
              >
                Đã nhận hàng
              </Button>
              <Button
                variant="outline"
                color="red"
                onClick={() => confirmDeliveredModal("CANCELLED")}
              >
                Yêu cầu Trả hàng/ Hoàn tiền
              </Button>
            </Flex>
          </Flex>
        )}
        {(detailOrder.status === "DELIVERED") && (
          <Flex
            className="card-table"
            mt={20}
            p={15}
            justify="space-between"
            align="center"
          >
            <Text></Text>
            <Flex py={10} gap="lg" justify="flex-end" align="center">
              <Button
                variant="outline"
                color="red"
                onClick={() => confirmDeliveredModal("CANCELLED")}
              >
                Yêu cầu Trả hàng/ Hoàn tiền
              </Button>
            </Flex>
          </Flex>
        )}
        <Modal
          opened={opened}
          onClose={close}
          centered
          title="Đánh giá sản phẩm"
          styles={() => ({
            title: {
              fontWeight: 'bold',
            },
          })}
        >
          <ReviewForm
            onSuccesSubmitAdd={() => onSuccesSubmitAdd}
            id={productReview?.id}
            name={productReview?.name}
            image={productReview?.image}
          />
        </Modal>
      </>
    )
  );
};

export default OrderHistoryDetail;
