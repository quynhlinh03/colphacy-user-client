import {
    Anchor,
    Button,
    Center,
    Container,
    Divider,
    Flex,
    Group,
    Image,
    Modal,
    Radio,
    Select,
    Switch,
    Table,
    Text,
    TextInput,
    Textarea,
    Title,
} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {
    IconChevronLeft,
    IconMapPinFilled,
    IconShieldCheckFilled,
    IconUser,
} from "@tabler/icons-react";
import {SelectedProductCardItem} from "../types/Cart";
import Map from "../components/Map/Map";
import {useDisclosure} from "@mantine/hooks";
import {useEffect, useState} from "react";
import {ChangeAddressForm} from "../components/Order/ChangeAddressForm";
import {useLocation} from "react-router-dom";
import {
    useDetailReceiver,
    useReceiver,
    useReceiverAddress,
} from "../hooks/useReceiver";
import {handleGlobalException} from "../utils/error";
import {Controller, useForm, SubmitHandler} from "react-hook-form";
import {
    findName,
    formatData,
    formatDataWards,
    getProductsInfo,
} from "../utils/common";
import {useOrder} from "../hooks/useOrder";
import {notificationShow} from "../components/Notification";
import {ErrorObject} from "../types/error";
import {modals} from "@mantine/modals";
import useCart from "../hooks/useCart";
import Cod from "../assets/images/cod.png";
import Vnpay from "../assets/images/vnpay.png";


export default function Order() {
    const location = useLocation();
    const {fetchListReceiverAddress, onSubmitAddReceiverAddress} =
        useReceiver();
    const {fetchCart} = useCart();
    const [openModal, setOpenModal] = useState(false);
    const [changeAddress, setChangeAddress] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [addressList, setAddressList] = useState<Receivers[]>();
    const [opened, {open, close}] = useDisclosure(false);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [selectAddressId, setSelectAddressId] = useState(""); //main
    const [addressId, setAddressId] = useState();
    const [selectAddress, setSelectAddress] = useState<Receivers>();
    const [showDetail, setShowDetail] = useState(true);
    const [noteValue, setNoteValue] = useState("");
    const {fetchDetailReceiverAddress, onSubmitDeleteReceiverAddress} =
        useDetailReceiver(+receiverAddress);
    const {onSubmitCreateOrder} = useOrder();
    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        setError,
    } = useForm({
        defaultValues: {
            id: -1,
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

    const navigate = useNavigate();

    if (!location.state) {
        navigate("/cart-management");
        return;
    }

    const allProducts = location.state
        .allProductCart as SelectedProductCardItem[];
    const getTotalPrice = location.state.totalPrice;

    const rows = allProducts?.map((element) => (
        <tr key={element.key}>
            <td className="td-group">
                <Image
                    width="100px"
                    height="100px"
                    radius="lg"
                    fit="scale-down"
                    src={element.image}
                />
                <span>{element.name}</span>
            </td>
            <td className="order-image">
                {element.salePrice.toLocaleString("vi-VN")}đ
            </td>
            <td>
                x{element.quanity} {element.unitName}
            </td>
        </tr>
    ));
    const [provinceId, setProvinceId] = useState(0);
    const [districtId, setDistrictId] = useState(0);
    const [branchesProvinces, setBranchesProvinces] = useState([]);
    const [branchesDistricts, setBranchesDistricts] = useState([]);
    const [branchesWards, setBranchesWards] = useState([]);
    const [isReloadata, setIsReloadata] = useState(false);
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const {fetchProvinces, fetchDistricts, fetchWards} = useReceiverAddress(
        provinceId,
        districtId
    );
    const [payFormat, setPayFormat] = useState('');
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
        setValue(
            "address.province",
            findName(value, branchesProvinces, "ProvinceID", "ProvinceName")
        );
        setProvinceId(value);
        setDistrictId(0);
        setValue("address.ward", "");
        setBranchesDistricts([]);
        setBranchesWards([]);
    };
    const formattedWards = formatDataWards(branchesWards);
    const handleDistrictsChange = (value: number) => {
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
    const handleSuccessSubmitAdd = () => {
        setIsReloadata(!isReloadata);
    };
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
                handleGlobalException(error, () => {
                });
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
                    handleGlobalException(error, () => {
                    });
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
                    handleGlobalException(error, () => {
                    });
                }
            }

            fetchAddWardsData();
        }
    }, [provinceId, districtId]);
    useEffect(() => {
        if (receiverAddress) {
            async function fetchDetailAddress() {
                const data = await fetchDetailReceiverAddress.refetch();
                if (data.isSuccess) {
                    if (data.data) {
                        setSelectAddress(data.data.data);
                    }
                } else if (data.isError) {
                    const error = data.error;
                    handleGlobalException(error, () => {
                    });
                }
            }

            fetchDetailAddress();
        }
    }, [receiverAddress]);

    useEffect(() => {
        async function fetchReceiverAddress() {
            const data = await fetchListReceiverAddress.refetch();
            if (data.isSuccess) {
                setAddressList(data.data.data);
                if (!receiverAddress) {
                    setSelectAddress(data.data.data[0]);
                    setReceiverAddress(data.data.data[0].id);
                }
                if (isOrderCreated) {
                    if (!receiverAddress) {
                        handleCreateNewOrder(data.data.data[0].id);
                    } else {
                        handleCreateNewOrder(+receiverAddress);
                    }
                    setIsOrderCreated(false);
                }
            } else if (data.isError) {
                const error = data.error;
                handleGlobalException(error, () => {
                });
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
    const handleCreateNewOrder = (id: number) => {
        const data = {
            receiverId: id,
            items: getProductsInfo(allProducts),
            note: noteValue,
            paymentMethod: payFormat
        };
        // onSubmitCreateOrder(data, () => {
        //   fetchCart();
        //   if(payFormat==="ONLINE"){

        //   }
        //   else{
        //     modals.open({
        //       centered: true,
        //       children: (
        //         <Flex direction="column">
        //           <Flex align="center">
        //             <IconShieldCheckFilled size={80} className="order-icon" />
        //             <Title order={4}>
        //               Bạn đã đặt đơn hàng thành công. Xin cảm ơn!
        //             </Title>
        //           </Flex>
        //           <Center>
        //             <Flex gap="md" pb={20}>
        //               <Button
        //                 w={190}
        //                 radius={50}
        //                 variant="outline"
        //                 onClick={() => {
        //                   modals.closeAll();
        //                   navigate("/personal/my-order");
        //                 }}
        //                 styles={(theme) => ({
        //                   root: {
        //                     color: theme.colors.munsellBlue[0],
        //                     ...theme.fn.hover({
        //                       color: theme.fn.darken(
        //                         theme.colors.munsellBlue[0],
        //                         0.1
        //                       ),
        //                     }),
        //                   },
        //                 })}
        //               >
        //                 Xem lịch sử mua hàng
        //               </Button>
        //               <Button
        //                 w={190}
        //                 radius={50}
        //                 onClick={() => {
        //                   modals.closeAll();
        //                   navigate("/");
        //                 }}
        //                 styles={(theme) => ({
        //                   root: {
        //                     backgroundColor: theme.colors.munsellBlue[0],
        //                     ...theme.fn.hover({
        //                       backgroundColor: theme.fn.darken(
        //                         theme.colors.munsellBlue[0],
        //                         0.1
        //                       ),
        //                     }),
        //                   },
        //                 })}
        //               >
        //                 Tiếp tục mua hàng
        //               </Button>
        //             </Flex>
        //           </Center>
        //         </Flex>
        //       ),
        //     });
        //   }
        // });
        onSubmitCreateOrder(data, (response) => {
            fetchCart();
            if (payFormat === "ONLINE") {
                const paymentLink = response.data.paymentLink;
                window.open(paymentLink, '_blank');
            } else {
                modals.open({
                    centered: true,
                    children: (
                        <Flex direction="column">
                            <Flex align="center">
                                <IconShieldCheckFilled size={80} className="order-icon"/>
                                <Title order={4}>
                                    Bạn đã đặt đơn hàng thành công. Xin cảm ơn!
                                </Title>
                            </Flex>
                            <Center>
                                <Flex gap="md" pb={20}>
                                    <Button
                                        w={190}
                                        radius={50}
                                        variant="outline"
                                        onClick={() => {
                                            modals.closeAll();
                                            navigate("/personal/my-order");
                                        }}
                                        styles={(theme) => ({
                                            root: {
                                                color: theme.colors.munsellBlue[0],
                                                ...theme.fn.hover({
                                                    color: theme.fn.darken(
                                                        theme.colors.munsellBlue[0],
                                                        0.1
                                                    ),
                                                }),
                                            },
                                        })}
                                    >
                                        Xem lịch sử mua hàng
                                    </Button>
                                    <Button
                                        w={190}
                                        radius={50}
                                        onClick={() => {
                                            modals.closeAll();
                                            navigate("/");
                                        }}
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
                                    >
                                        Tiếp tục mua hàng
                                    </Button>
                                </Flex>
                            </Center>
                        </Flex>
                    ),
                    closeOnClickOutside: false,
                    withCloseButton: false
                });
            }
        });
    };
    const onSubmit: SubmitHandler<Receivers> = (data) => {
        if (!addressList?.length) {
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
            onSubmitAddReceiverAddress(
                data,
                () => {
                    setIsReloadata(!isReloadata);
                    setIsOrderCreated(true);
                },
                handleError
            );
        } else {
            setIsReloadata(!isReloadata);
            setIsOrderCreated(true);
        }
    };

    return (
        <>
            <Container className="breadcrumbs" size={1300} pt={5} pb={30}>
                <Anchor href="/cart-management">
                    <Flex mx="xs" gap={10}>
                        <IconChevronLeft/>
                        Quay về giỏ hàng
                    </Flex>
                </Anchor>
            </Container>
            <Container size={1300}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex py={6} justify="center" gap="4rem">
                        <Flex gap="xs" direction="column" w="60%">
                            <Text>Danh sách sản phẩm ({allProducts.length})</Text>
                            <Table
                                mt="1rem"
                                className="card-table"
                                mb="1.2rem"
                                mr="1em"
                                highlightOnHover
                            >
                                <tbody>{rows}</tbody>
                            </Table>
                            <Text>Nhận hàng</Text>
                            <Container my="1rem" className="order-form" w="100%">
                                <Flex>
                                    <IconMapPinFilled size={20} className="order-icon"/>
                                    <Flex direction="column" gap="lg" align="flex-start">
                                        <Text>Địa chỉ nhận hàng</Text>
                                        {addressList?.length ? (
                                            <Text>
                                                {selectAddress?.address?.streetAddress},{" "}
                                                {selectAddress?.address?.ward},{" "}
                                                {selectAddress?.address?.district},{" "}
                                                {selectAddress?.address?.province}
                                            </Text>
                                        ) : (
                                            <>
                                                <Flex direction={{base: "row"}} gap="xs">
                                                    <Controller
                                                        name="address.province"
                                                        control={control}
                                                        rules={{required: "Vui lòng chọn Tỉnh/ Thành"}}
                                                        render={({field}) => {
                                                            return (
                                                                <Select
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
                                                        rules={{required: "Vui lòng chọn Quận/ Huyện"}}
                                                        render={({field}) => (
                                                            <Select
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
                                                        rules={{required: "Vui lòng chọn Phường/ Xã"}}
                                                        render={({field}) => (
                                                            <Select
                                                                p={10}
                                                                {...field}
                                                                name="address.ward"
                                                                required
                                                                placeholder="Chọn Phường/ Xã"
                                                                data={formattedWards}
                                                                onChange={handleWardsChange}
                                                                error={
                                                                    errors.address?.ward
                                                                        ? errors.address.ward.message
                                                                        : false
                                                                }
                                                            />
                                                        )}
                                                    ></Controller>
                                                </Flex>
                                                <div style={{width: "100%"}}>
                                                    <div>
                                                        <Map
                                                            errors={errors}
                                                            isView={false}
                                                            onDrag={handleDrag}
                                                            onStreetAddressChange={handleStreetAddressChange}
                                                            control={control}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </Flex>
                                    {addressList?.length ? (
                                        <Anchor
                                            component="button"
                                            type="button"
                                            ml="auto"
                                            onClick={() => {
                                                setChangeAddress(true);
                                                open();
                                            }}
                                        >
                                            Thay đổi
                                        </Anchor>
                                    ) : (
                                        <></>
                                    )}
                                </Flex>
                                <Divider my="lg"/>
                                <Flex align="flex-start">
                                    <IconUser size={20} className="order-icon"/>
                                    <Flex direction="column" w="100%" gap="xs" align="flex-start">
                                        <Text>Thông tin người nhận</Text>
                                        <Flex direction="row" gap="xs" w="100%">
                                            {addressList?.length ? (
                                                <>
                                                    <Text>{selectAddress?.name}</Text>
                                                    <Divider orientation="vertical"/>
                                                    <Text>{selectAddress?.phone}</Text>
                                                </>
                                            ) : (
                                                <Flex direction="row" gap="xs" w="100%" p={10}>
                                                    <div style={{width: "50%"}}>
                                                        <Controller
                                                            name="name"
                                                            control={control}
                                                            rules={{required: "Vui lòng nhập Họ tên"}}
                                                            render={({field}) => (
                                                                <TextInput
                                                                    {...field}
                                                                    placeholder="Họ tên"
                                                                    radius="md"
                                                                    onChange={(value) => {
                                                                        field.onChange(value);
                                                                    }}
                                                                    error={
                                                                        errors.name ? errors.name.message : false
                                                                    }
                                                                />
                                                            )}
                                                        ></Controller>
                                                    </div>
                                                    <div style={{width: "50%"}}>
                                                        <Controller
                                                            name="phone"
                                                            control={control}
                                                            rules={{
                                                                required: "Vui lòng nhập Số điện thoại",
                                                            }}
                                                            render={({field}) => (
                                                                <TextInput
                                                                    width="100%"
                                                                    {...field}
                                                                    placeholder="SĐT"
                                                                    radius="md"
                                                                    error={
                                                                        errors.phone ? errors.phone.message : false
                                                                    }
                                                                />
                                                            )}
                                                        ></Controller>
                                                    </div>
                                                </Flex>
                                            )}
                                        </Flex>
                                    </Flex>
                                </Flex>
                                {!addressList?.length && (
                                    <Flex m={10} justify="flex-end">
                                        <Text pr={10}>Đặt làm địa chỉ mặc định</Text>
                                        <Controller
                                            name="isPrimary"
                                            control={control}
                                            render={({field}) => (
                                                <Switch
                                                    {...field}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value.toString()}
                                                />
                                            )}
                                        ></Controller>
                                    </Flex>
                                )}
                                <Textarea
                                    placeholder="Thêm ghi chú (ví dụ: Hãy gọi trước khi giao)"
                                    my="lg"
                                    mr={10}
                                    ml={20}
                                    value={noteValue}
                                    onChange={(event) => setNoteValue(event.currentTarget.value)}
                                />
                                {/* <Divider my="xs" />
                <Flex align="flex-start">
                  <IconClockFilled size={20} className="order-icon" />
                  <Flex direction="row" gap="sm">
                    <Text>Thời gian giao hàng dự kiến</Text>
                    <Text size={11} mt={3}>
                      0123456870
                    </Text>
                  </Flex>
                  <Anchor component="button" type="button" ml="auto">
                    Thay đổi
                  </Anchor>
                </Flex> */}
                            </Container>

                            <Text>Hình thức thanh toán</Text>
                            <Container my="1rem" className="order-form" w="100%">
                                <Radio.Group
                                    value={payFormat}
                                    onChange={setPayFormat}
                                    name="favoriteFramework"
                                    withAsterisk
                                >
                                    <Flex gap="lg" align="center" mb={20}>
                                        <Radio value="ON_DELIVERY"/>
                                        <Image src={Cod} width={50}/>
                                        <Text>Thanh toán tiền mặt khi nhận hàng</Text>
                                    </Flex>
                                    <Flex gap="lg" align="center">
                                        <Radio value="ONLINE"/>
                                        <Image src={Vnpay} width={50}/>
                                        <Text>Thanh toán bằng thẻ ATM nội địa (Qua VNPay)</Text>
                                    </Flex>
                                </Radio.Group>
                            </Container>
                        </Flex>
                        <Flex gap="xs" direction="column" w="30%" mt="1rem">
                            <Text className="order-text-unvisible">""</Text>
                            {/* <form className="order-form" onSubmit={onSubmit}> */}
                            <Flex mb="0rem">
                                <Text>Tổng tiền</Text>
                                <Text ml="auto">{getTotalPrice.toLocaleString("vi-VN")} đ</Text>
                            </Flex>
                            <Divider my="xs"/>
                            <Flex mb="0rem">
                                <Text>Phí vận chuyển</Text>
                                <Text ml="auto" className="fee-shipment">
                                    Miến phí
                                </Text>
                            </Flex>
                            <Divider my="xs"/>
                            <Flex mb="0rem">
                                <Title fz={16} fw={700} order={4}>
                                    Thành tiền
                                </Title>
                                <Title fz={16} fw={700} order={4} ml="auto">
                                    {getTotalPrice.toLocaleString("vi-VN")} đ
                                </Title>
                            </Flex>
                            <Button
                                mt="1rem"
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
                                Hoàn tất ({allProducts.length})
                            </Button>
                        </Flex>
                    </Flex>
                    <Modal
                        opened={changeAddress}
                        onClose={() => {
                            setChangeAddress(false);
                        }}
                        p={0}
                        m={20}
                        title="Chọn địa chỉ nhận hàng"
                        styles={() => ({
                            title: {
                                fontWeight: "bold",
                            },
                        })}
                        yOffset="0"
                        centered
                        size="lg"
                    >
                        <Container>
                            <Radio.Group
                                value={selectAddressId}
                                onChange={setSelectAddressId}
                            >
                                {addressList?.map((address) => (
                                    <Container
                                        key={address.id}
                                        onClick={() => {
                                            setIsEdit(false);
                                            setOpenModal(true);
                                            setShowDetail(true);
                                            setAddressId(address.id);
                                        }}
                                    >
                                        <Divider my="xs"/>
                                        <Flex direction="row" align="center" gap="xs">
                                            <Radio
                                                mr={10}
                                                value={address.id.toString()}
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                }}
                                            />
                                            <Flex direction="column" gap="xs" align="flex-start">
                                                <Text>{address.name}</Text>
                                                <Text>{address.phone}</Text>
                                                <Text>
                                                    {address?.address?.streetAddress},{" "}
                                                    {address?.address?.ward}, {address?.address?.district}
                                                    , {address?.address?.province}
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
                            </Radio.Group>
                            <Flex
                                justify="center"
                                align="center"
                                mx="auto"
                                mt="3rem"
                                mb="1rem"
                                direction="row"
                                gap="xs"
                                className="btn-modal"
                            >
                                <Button
                                    w="10rem"
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
                                        setChangeAddress(false);
                                        setReceiverAddress(selectAddressId);
                                    }}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    w="10rem"
                                    variant="outline"
                                    onClick={() => {
                                        setOpenModal(true);
                                        setIsEdit(false);
                                        setShowDetail(false);
                                    }}
                                >
                                    Thêm địa chỉ mới
                                </Button>
                            </Flex>
                        </Container>
                    </Modal>
                </form>
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
