import { useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import { Center, Container, Flex, Radio, Text } from "@mantine/core";
import { useBranch } from "../../hooks/useBranch";
import React from "react";
import { IconChevronsDown } from "@tabler/icons-react";

interface NearestBranchProps {
  onValueChange: (newValue: number) => void;
  id?: number;
}

export default function NearestBranch({
  onValueChange,
  id,
}: NearestBranchProps) {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });
  const [value, setValue] = useState("");
  const [currentLocation, setCurrentLocation] = useState<NearestProps>({
    longitude: 0,
    latitude: 0,
    offset: 0,
    limit: 5,
  });
  const {
    dataNearest,
    errorNearest,
    fetchNextPageNearest,
    hasNextPageNearest,
    isFetchingNextPageNearest,
    statusNearest,
    refetchNearest,
  } = useBranch(currentLocation, +value);
  useEffect(() => {
    if (coords) {
      setCurrentLocation({
        longitude: coords.longitude,
        latitude: coords.latitude,
        offset: 0,
        limit: 5,
      });
    }
  }, [coords, isGeolocationAvailable, isGeolocationEnabled]);
  useEffect(() => {
    if (currentLocation.latitude != 0) {
      refetchNearest();
    }
  }, [currentLocation]);
  useEffect(() => {
    if (id) {
      setValue(id.toString());
    }
  }, [id]);

  return (
    <>
      {!isGeolocationAvailable ? (
        <Text color="red" p={10}>
          Trình duyệt không hỗ trợ Geolocation.
        </Text>
      ) : !isGeolocationEnabled ? (
        <Text color="red" p={10}>
          Vị trí không khả dụng. Vui lòng bật định vị để sử dụng tính năng này.
        </Text>
      ) : coords ? (
        <>
          {statusNearest === "loading" ? (
            <Text fz={13} px={15} py={10}>
              Đang tải...
            </Text>
          ) : statusNearest === "error" ? (
            <Text fz={13} px={15} py={10}>
              Error: {errorNearest.message}
            </Text>
          ) : (
            <>
              <Radio.Group
                value={value}
                onChange={(value) => {
                  setValue(value);
                  onValueChange(+value);
                }}
              >
                {dataNearest.pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {group.data.items.map((element) => (
                      <Container px={15} py={10} key={element.id}>
                        <Radio
                          value={element.id.toString()}
                          label={element.address}
                        />
                      </Container>
                    ))}
                  </React.Fragment>
                ))}
                <div style={{ cursor: "pointer", color: "#00439c" }}>
                  <Center p={8} onClick={() => fetchNextPageNearest()}>
                    {isFetchingNextPageNearest ? (
                      "Đang tải..."
                    ) : hasNextPageNearest ? (
                      <Flex
                        gap="xs"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="wrap"
                      >
                        <IconChevronsDown size={12} />
                        Xem thêm
                      </Flex>
                    ) : (
                      ""
                    )}
                  </Center>
                </div>
              </Radio.Group>
            </>
          )}
        </>
      ) : (
        <Text color="red" p={10}>
          Vị trí không hợp lệ.
        </Text>
      )}
    </>
  );
}
