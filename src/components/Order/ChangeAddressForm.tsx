import {
  Button,
  Flex,
  Grid,
  Select,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import {
  useDetailReceiver,
  useReceiver,
  useReceiverAddress,
} from "../../hooks/useReceiver";
import Map from "../../components/Map/Map";
import { notificationShow } from "../Notification";
import isEmpty from "lodash/isEmpty";
import {
  findId,
  findName,
  formatData,
  formatDataWards,
} from "../../utils/common";
interface ChangeAddressFormProps {
  close: () => void;
  showDetail: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  idReceiver?: number;
  onSuccesSubmit: () => void;
}
export const ChangeAddressForm: React.FC<ChangeAddressFormProps> = ({
  close,
  setOpenModal,
  showDetail,
  isEdit,
  idReceiver,
  onSuccesSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    setError,
  } = useForm({
    defaultValues: {
      id: 0,
      name: "",
      phone: "",
      address: {
        streetAddress: "",
        ward: "",
        district: "",
        province: "",
        latitude: 0,
        longitude: 0,
      },
      isPrimary: true,
    },
  });
  const { fetchDetailReceiverAddress } = useDetailReceiver(+idReceiver);
  const [detailReceiver, setDetailReceiver] = useState();
  const [provinceId, setProvinceId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [branchesDistricts, setBranchesDistricts] = useState([]);
  const [branchesWards, setBranchesWards] = useState([]);
  const [viewLat, setViewLat] = useState();
  const [viewLng, setViewLng] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditProvince, setIsEditProvince] = useState(false);

  const { fetchProvinces, fetchDistricts, fetchWards } = useReceiverAddress(
    provinceId,
    districtId
  );
  const { onSubmitAddReceiverAddress, onSubmitEditReceiverAddress } =
    useReceiver();

  const formattedProvinces = formatData(
    branchesProvinces,
    "ProvinceID",
    "ProvinceName"
  );
  const formattedDistricts = formatData(
    branchesDistricts,
    "DistrictID",
    "DistrictName"
  );
  const handleProvincesChange = (value: number) => {
    setIsEditProvince(true);
    setValue(
      "address.province",
      findName(value, branchesProvinces, "ProvinceID", "ProvinceName")
    );
    setProvinceId(value);
    setDistrictId(0);
    setValue("address.ward", "");
    setBranchesDistricts([]);
    setBranchesWards([]);
    if (isEdit) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  };
  const formattedWards = formatDataWards(branchesWards);
  const handleDistrictsChange = (value: number) => {
    setIsEditProvince(true);
    setValue(
      "address.district",
      findName(value, branchesDistricts, "DistrictID", "DistrictName")
    );
    setDistrictId(value);
    setValue("address.ward", "");
    setBranchesWards([]);
  };
  const handleWardsChange = (value: string) => {
    setValue("address.ward", value);
  };
  const handleStreetAddressChange = (address: string) => {
    setValue("address.streetAddress", address);
  };
  const handleDrag = (lat: number, lng: number) => {
    setValue("address.latitude", lat);
    setValue("address.longitude", lng);
  };

  useEffect(() => {
    if (showDetail) {
      async function fetchStatusData() {
        const data = await fetchDetailReceiverAddress.refetch();
        if (data.isSuccess) {
          if (data.data) {
            setDetailReceiver(data.data.data);
          }
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchStatusData();
    }
  }, []);
  useEffect(() => {
    if (showDetail && idReceiver && !isEmpty(branchesProvinces)) {
      async function fetchDetailReceiver() {
        const data = await fetchDetailReceiverAddress.refetch();
        if (data.isSuccess) {
          if (data.data) {
            const result = data.data.data;
            setDetailReceiver(result);
            Object.keys(result).forEach((key) => {
              if (key === "address") {
                Object.keys(result["address"]).forEach((key) => {
                  if (key === "province") {
                    const Id = findId(
                      result["address"][key],
                      branchesProvinces,
                      "ProvinceID",
                      "ProvinceName"
                    );
                    setValue("address.province", Id);
                    setProvinceId(Number(Id));
                  } else if (key === "streetAddress") {
                    setValue("address.streetAddress", result["address"][key]);
                  } else if (key === "longitude") {
                    setValue("address.longitude", result["address"][key]);
                    setViewLng(result["address"][key]);
                  } else if (key === "latitude") {
                    setValue("address.latitude", result["address"][key]);
                    setViewLat(result["address"][key]);
                  }
                });
              } else {
                setValue(key, result[key]);
              }
            });
          }
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchDetailReceiver();
    }
  }, [idReceiver, branchesProvinces]);

  useEffect(() => {
    if (!isEditing && detailReceiver && !isEmpty(branchesDistricts)) {
      Object.keys(detailReceiver["address"]).forEach((key) => {
        if (key === "district") {
          const Id = branchesDistricts.every((branch) =>
            branch.hasOwnProperty("DistrictID")
          )
            ? findId(
                detailReceiver["address"][key],
                branchesDistricts,
                "DistrictID",
                "DistrictName"
              )
            : null;
          setValue("address.district", Number(Id));
          setDistrictId(Number(Id));
        }
      });
    }
  }, [detailReceiver, branchesDistricts]);

  useEffect(() => {
    if (detailReceiver && !isEmpty(branchesWards)) {
      Object.keys(detailReceiver["address"]).forEach((key) => {
        if (key === "ward") {
          setValue("address.ward", detailReceiver["address"][key]);
        }
      });
    }
  }, [detailReceiver, branchesWards]);

  useEffect(() => {
    if (provinceId === null) {
      setBranchesDistricts([]);
    }
    async function fetchAddProvincesData() {
      const data = await fetchProvinces.refetch();
      if (data.isSuccess) {
        setBranchesProvinces(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchAddProvincesData();
    if (provinceId) {
      async function fetchAddDistrictsData() {
        const data = await fetchDistricts.refetch();
        if (data.isSuccess) {
          setBranchesDistricts(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchAddDistrictsData();
    }
    if (districtId) {
      async function fetchAddWardsData() {
        const data = await fetchWards.refetch();
        if (data.isSuccess) {
          setBranchesWards(data.data.data);
        } else if (data.isError) {
          const error = data.error;
          handleGlobalException(error, () => {});
        }
      }
      fetchAddWardsData();
    }
  }, [provinceId, districtId]);

  const onSubmit: SubmitHandler<Receivers> = (data, event) => {
    const handleSuccess = (message: string) => {
      onSuccesSubmit();
      close();
      notificationShow("success", "Success!", message);
    };

    const handleError = (error) => {
      handleGlobalException(error, () => {
        setError("name", {
          type: "manual",
          message: error.response.data.name,
        });
        setError("phone", {
          type: "manual",
          message: error.response.data.phone,
        });
        setError("address.province", {
          type: "manual",
          message: error.response.data.address.province,
        });
        setError("address.district", {
          type: "manual",
          message: error.response.data.address.district,
        });
        setError("address.ward", {
          type: "manual",
          message: error.response.data.address.ward,
        });
        setError("address.streetAddress", {
          type: "manual",
          message: error.response.data.address.streetAddress,
        });
        setError("address.latitude", {
          type: "manual",
          message: error.response.data.address.latitude,
        });
        setError("address.longitude", {
          type: "manual",
          message: error.response.data.address.longitude,
        });
        setError("isPrimary", {
          type: "manual",
          message: error.response.data.isPrimary,
        });
      });
    };

    if (!isEditProvince) {
      data.address.province = findName(
        +getValues("address.province"),
        branchesProvinces,
        "ProvinceID",
        "ProvinceName"
      );

      data.address.district = findName(
        +getValues("address.district"),
        branchesDistricts,
        "DistrictID",
        "DistrictName"
      );
    }

    if (!isEdit && !showDetail) {
      onSubmitAddReceiverAddress(
        data,
        () => {
          handleSuccess("Thêm địa chỉ mới thành công!");
          close();
          setOpenModal(false);
        },
        handleError
      );
    } else {
      onSubmitEditReceiverAddress(
        data,
        () => {
          handleSuccess("Chỉnh sửa nhánh thành công!");
          setOpenModal(false);
        },
        handleError
      );
    }
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex
          direction={{ base: "column" }}
          mt={20}
          gap="xs"
          align="flex-start"
        >
          <Flex direction={{ base: "column" }} gap="xs">
            <Text ta="left" mb={5}>
              Thông tin người nhận
            </Text>
            <Flex direction={{ base: "row" }} gap="xs">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Vui lòng nhập Họ tên" }}
                render={({ field }) => (
                  <TextInput
                    style={
                      showDetail && !isEdit
                        ? {
                            pointerEvents: "none",
                          }
                        : {}
                    }
                    {...field}
                    label="Họ tên"
                    radius="md"
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    error={errors.name ? errors.name.message : false}
                  />
                )}
              ></Controller>
              <Controller
                name="phone"
                control={control}
                rules={{ required: "Vui lòng nhập Số điện thoại" }}
                render={({ field }) => (
                  <Flex align="center">
                    <TextInput
                      style={
                        showDetail && !isEdit
                          ? {
                              pointerEvents: "none",
                            }
                          : {}
                      }
                      {...field}
                      label="SĐT"
                      radius="md"
                      error={errors.phone ? errors.phone.message : false}
                    />
                  </Flex>
                )}
              ></Controller>
            </Flex>
          </Flex>
          <Flex direction={{ base: "column" }} gap="xs">
            <Text ta="left">Địa chỉ nhận hàng</Text>
            <Flex direction={{ base: "row" }} gap="xs">
              <Controller
                name="address.province"
                control={control}
                rules={{ required: "Vui lòng chọn Tỉnh/ Thành" }}
                render={({ field }) => {
                  return (
                    <Select
                      style={
                        showDetail && !isEdit
                          ? {
                              pointerEvents: "none",
                            }
                          : {}
                      }
                      p={10}
                      {...field}
                      name="address.province"
                      required
                      placeholder="Chọn Tỉnh/ Thành"
                      data={formattedProvinces}
                      onChange={handleProvincesChange}
                      value={provinceId}
                      error={
                        errors.address?.province
                          ? errors.address.province.message
                          : false
                      }
                    />
                  );
                }}
              ></Controller>
              <Controller
                name="address.district"
                control={control}
                rules={{ required: "Vui lòng chọn Quận/ Huyện" }}
                render={({ field }) => (
                  <Select
                    style={
                      showDetail && !isEdit
                        ? {
                            pointerEvents: "none",
                          }
                        : {}
                    }
                    p={10}
                    {...field}
                    name="address.district"
                    required
                    placeholder="Chọn Quận/ Huyện"
                    data={formattedDistricts}
                    onChange={handleDistrictsChange}
                    value={districtId}
                    error={
                      errors.address?.district
                        ? errors.address.district.message
                        : false
                    }
                  />
                )}
              ></Controller>
              <Controller
                name="address.ward"
                control={control}
                rules={{ required: "Vui lòng chọn Phường/ Xã" }}
                render={({ field }) => (
                  <Select
                    style={
                      showDetail && !isEdit
                        ? {
                            pointerEvents: "none",
                          }
                        : {}
                    }
                    p={10}
                    {...field}
                    name="address.ward"
                    required
                    placeholder="Chọn Phường/ Xã"
                    data={formattedWards}
                    onChange={handleWardsChange}
                    error={
                      errors.address?.ward ? errors.address.ward.message : false
                    }
                  />
                )}
              ></Controller>
            </Flex>
            <div>
              {viewLat && viewLng && (
                <div>
                  <Map
                    isView={true}
                    onStreetAddressChange={handleStreetAddressChange}
                    initialLat={viewLat}
                    initialLng={viewLng}
                  />
                </div>
              )}
              {!viewLat && !viewLng && (
                <div>
                  <Map
                    errors={errors}
                    isView={showDetail && !isEdit}
                    onDrag={handleDrag}
                    onStreetAddressChange={handleStreetAddressChange}
                    control={control}
                  />
                </div>
              )}
            </div>
          </Flex>
          <Grid w="100%" justify="space-between" my="xs">
            <Grid.Col span="content">
              <Flex justify="flex-start">
                <Text>Đặt làm địa chỉ mặc định</Text>
              </Flex>
            </Grid.Col>
            <Grid.Col span="auto">
              <Flex justify="flex-end">
                <Controller
                  name="isPrimary"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      style={
                        showDetail && !isEdit
                          ? {
                              pointerEvents: "none",
                            }
                          : {}
                      }
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                      }}
                      checked={field.value}
                    />
                  )}
                ></Controller>
              </Flex>
            </Grid.Col>
          </Grid>
          {!(showDetail && !isEdit) && (
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
              type="submit"
            >
              Hoàn thành
            </Button>
          )}
        </Flex>
      </form>
    </>
  );
};
