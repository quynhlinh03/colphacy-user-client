import { Button, Container, Divider, Flex, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import { notificationShow } from "../Notification";
import Map from "../Map/Map";
import { useBranch } from "../../hooks/useBranch";

export const DetailBranch: React.FC<{ id: number }> = ({ id }) => {
  const { fetchDetailBranch } = useBranch(
    { longitude: 0, latitude: 0, offset: 0, limit: 5 },
    id
  );
  const [detailBranch, setDetailBranch] = useState<DetailBranch>();
  useEffect(() => {
    if (id) {
      async function fetchDetail() {
        const data = await fetchDetailBranch.refetch();
        if (data.isSuccess) {
          setDetailBranch(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {
            if (error.response.status === 400) {
              const data = error.response.data;
              Object.keys(data).forEach((key) => {
                notificationShow("error", "Error!", data[key]);
              });
            }
          });
        }
      }
      fetchDetail();
    }
  }, [id]);
  return (
    detailBranch && (
      <>
        <Text px={10} py={7} fw={500} fz={16}>
          Nhà thuốc Colphacy {detailBranch.streetAddress},{" "}
          {detailBranch.district}, {detailBranch.province}
        </Text>
        <Flex
          justify="space-between"
          align="center"
          direction="row"
          wrap="wrap"
          pb={10}
        >
          <Container p={0} m={0} w="56%">
            <Map
              isView={true}
              initialLat={detailBranch.latitude}
              initialLng={detailBranch.longitude}
            />
          </Container>
          <Flex
            w="42%"
            gap="md"
            justify="center"
            align="flex-start"
            direction="column"
            wrap="wrap"
          >
            <Text>
              <span style={{ color: "#4a4f63" }}>Địa chỉ: </span>
              <span>
                {detailBranch.streetAddress}, {detailBranch.district},{" "}
                {detailBranch.province}
              </span>
            </Text>
            <Text>
              <span style={{ color: "#4a4f63" }}>Thời gian hoạt động: </span>
              <span>
                {detailBranch.openingHour} - {detailBranch.closingHour}
              </span>
            </Text>
            <Text>
              <span style={{ color: "#4a4f63" }}>Số điện thoại: </span>
              <span>{detailBranch.phone}</span>
            </Text>
            <Flex
              gap="sm"
              justify="center"
              align="flex-start"
              direction="row"
              wrap="wrap"
            >
              <Button
                radius="xl"
                styles={(theme) => ({
                  root: {
                    backgroundColor: theme.colors.cobaltBlue[0],
                    ...theme.fn.hover({
                      backgroundColor: theme.fn.darken(
                        theme.colors.cobaltBlue[0],
                        0.1
                      ),
                    }),
                  },
                })}
                onClick={() => {
                  window.open(
                    `https://maps.google.com/maps/place/${detailBranch.latitude},${detailBranch.longitude}`,
                    "_blank"
                  );
                }}
              >
                Xem chỉ đường
              </Button>
              <Button
                variant="white"
                radius="xl"
                styles={(theme) => ({
                  root: {
                    color: theme.colors.cobaltBlue[0],
                    ...theme.fn.hover({
                      color: theme.fn.darken(theme.colors.cobaltBlue[0], 0.1),
                    }),
                  },
                })}
                onClick={() =>
                  window.open(`tel:${detailBranch.phone}`, "_self")
                }
              >
                Gọi tư vấn
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <Divider pt={10} size="xs" />
      </>
    )
  );
};
