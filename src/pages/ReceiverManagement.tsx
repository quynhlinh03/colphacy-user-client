import {
  Button,
  Grid,
  Text,
  Container,
  Anchor,
  Modal,
  Flex,
  Divider,
  Breadcrumbs,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useDetailReceiver, useReceiver } from "../hooks/useReceiver";
import { handleGlobalException } from "../utils/error";
import { ChangeAddressForm } from "../components/Order/ChangeAddressForm";
import { notificationShow } from "../components/Notification";
import { ErrorObject } from "../types/error";

export default function ReceiverManagement() {
  const { fetchListReceiverAddress } = useReceiver();
  const { onSubmitDeleteReceiverAddress } = useDetailReceiver(0);
  const [isReloadata, setIsReloadata] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(true);
  const [addressId, setAddressId] = useState();
  const [addressList, setAddressList] = useState<Receivers[]>();

  const handleSuccessSubmitAdd = () => {
    setIsReloadata(!isReloadata);
  };
  useEffect(() => {
    async function fetchReceiverAddress() {
      const data = await fetchListReceiverAddress.refetch();
      if (data.isSuccess) {
        setAddressList(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchReceiverAddress();
  }, [isReloadata]);
  const handleDeleteReceiver = async (id: number) => {
    await onSubmitDeleteReceiverAddress(
      id,
      () => {
        setIsReloadata(!isReloadata);
      },
      (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
            });
          }
        });
      }
    );
  };
  return (
    <>
      <Container>
        <Grid justify="space-between" align="center" pb={10}>
          <Grid.Col span="auto">
            <Text fz={16} fw={500}>
              Quản lý sổ địa chỉ
            </Text>
          </Grid.Col>
          <Grid.Col span="content">
            <Button
              w="100%"
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
                setOpenModal(true);
                setIsEdit(false);
                setShowDetail(false);
              }}
            >
              Thêm địa chỉ mới
            </Button>
          </Grid.Col>
        </Grid>
        {addressList &&
          addressList.map((address) => (
            <Container
              className="receiver-ctn"
              key={address.id}
              onClick={() => {
                setIsEdit(false);
                setOpenModal(true);
                setShowDetail(true);
                setAddressId(address.id);
              }}
            >
              <Flex direction="row" align="center" gap="xs">
                <Flex direction="column" gap="xs" align="flex-start">
                  <Flex direction="row" gap="xs">
                    <Text fw={500}>{address.name}</Text>
                    <Divider orientation="vertical" />
                    <Text className="receiver-text" fw={400}>
                      {address.phone}
                    </Text>
                  </Flex>
                  <Text className="receiver-text" fw={400}>
                    {address?.address?.streetAddress}, {address?.address?.ward},{" "}
                    {address?.address?.district}, {address?.address?.province}
                  </Text>
                </Flex>
                <Flex
                  direction="row"
                  gap="xs"
                  align="center"
                  justify="flex-end"
                  ml="auto"
                >
                  <Anchor
                    component="button"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setOpenModal(true);
                      setIsEdit(true);
                      setAddressId(address.id);
                      setShowDetail(true);
                    }}
                  >
                    Sửa
                  </Anchor>
                  {!(addressList.length === 1) && (
                    <Anchor
                      component="button"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteReceiver(+address.id);
                      }}
                    >
                      Xóa
                    </Anchor>
                  )}
                </Flex>
              </Flex>
            </Container>
          ))}
        <Modal
          opened={openModal}
          onClose={() => {
            close();
            setOpenModal(false);
          }}
          p={0}
          m={20}
          title={
            !showDetail
              ? "Thêm địa chỉ mới"
              : isEdit
              ? "Sửa địa chỉ"
              : "Xem địa chi"
          }
          styles={() => ({
            title: {
              fontWeight: "bold",
            },
          })}
          centered
          size="xl"
        >
          <Container>
            <ChangeAddressForm
              isEdit={isEdit}
              idReceiver={addressId}
              close={close}
              setOpenModal={setOpenModal}
              showDetail={showDetail}
              onSuccesSubmit={handleSuccessSubmitAdd}
            />
          </Container>
        </Modal>
      </Container>
    </>
  );
}
