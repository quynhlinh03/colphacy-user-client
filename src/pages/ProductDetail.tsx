import {
  ActionIcon,
  Alert,
  Anchor,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Flex,
  Grid,
  Group,
  NumberInput,
  Table,
  Tabs,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconBuildingHospital,
  IconPointFilled,
  IconShoppingCartFilled,
  IconStarFilled,
} from "@tabler/icons-react";
import { formatNumberWithCommas, getNameById } from "../utils/common";
import { Carousel } from "@mantine/carousel";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Image } from "@mantine/core";
import change from "../assets/images/change.png";
import free from "../assets/images/free.png";
import freeDelivery from "../assets/images/free-delivery.png";
import { useNavigate, useParams } from "react-router-dom";
import { handleGlobalException } from "../utils/error";
import { useDetailProduct } from "../hooks/useProduct";
import { useListUnit } from "../hooks/useUnit";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { Review } from "../components/Review/Review";

function getIdByName(name: string, category: Category[]) {
  let categoryItem = category.find((item) => item.name === name);
  return categoryItem ? categoryItem.id : -1;
}

function findMaxRatioDefaultUnitIdOrPrice(productUnits: ProductUnitProps[]) {
  let maxRatioUnit = productUnits.reduce((max, unit) =>
    unit.ratio > max.ratio && unit.defaultUnit ? unit : max
  );
  return maxRatioUnit.unitId;
}

function getSalePriceByUnitId(
  productUnits: ProductUnitProps[],
  unitId: number
) {
  const unit = productUnits.find((unit) => unit.unitId === unitId);
  return unit ? unit.salePrice : 0;
}

function ProductDetail() {
  const { fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const { fetchDetailProduct } = useDetailProduct(params.id);
  const { fetchListUnit } = useListUnit();

  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const [productDetail, setProductDetail] = useState<ProductDetailProps>();
  const [unitList, setUnitList] = useState<Category[]>();
  const [unitProductList, setUnitProductList] = useState<[]>();
  const [valueUnit, setValueUnit] = useState<string>("");
  const [valueInput, setValueInput] = useState<number | "">(1);

  const slides = productDetail?.images.map((image) => (
    <Carousel.Slide key={image}>
      <Image radius="md" src={image} />
    </Carousel.Slide>
  ));
  const items = [
    { title: "Trang chủ", href: "/" },
    {
      title: `${productDetail?.category?.name}`,
      href: `category/${productDetail?.category?.id}`,
    },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));
  const rows = productDetail?.ingredients.map((ingredient) => (
    <tr key={ingredient.name}>
      <td>{ingredient.name}</td>
      <td>{ingredient.amount}</td>
    </tr>
  ));
  useEffect(() => {
    async function fetchUnit() {
      const data = await fetchListUnit.refetch();
      if (data.isSuccess) {
        setUnitList(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchUnit();
    async function fetchDetailProductValue() {
      const data = await fetchDetailProduct.refetch();
      if (data.isSuccess) {
        setProductDetail(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchDetailProductValue();
  }, []);
  useEffect(() => {
    if (productDetail && unitList) {
      const name = getNameById(
        findMaxRatioDefaultUnitIdOrPrice(productDetail.productUnits),
        unitList
      );
      if (name) {
        setValueUnit(name);
      }

      const unitProductArr = productDetail.productUnits
        .filter((unit) => unit.defaultUnit)
        .map((unit) => getNameById(unit.unitId, unitList));

      const hocUnit = unitProductArr.splice(unitProductArr.indexOf(name), 1);
      unitProductArr.unshift(hocUnit[0]);

      setUnitProductList(unitProductArr);
    }
  }, [productDetail, unitList]);
  const { onSubmitAddPrductCart } = useCart();
  const onSubmit = (data: AddProductCartProps) => {
    onSubmitAddPrductCart(
      data,
      () => {
        fetchCart();
      },
      (error) => {
        if (!isAuthenticated)
          navigate("/", {
            state: { openLoginModal: true },
          });
        else handleGlobalException(error, () => {});
      }
    );
  };
  return (
    <>
      <Container className="breadcrumbs" size={1090} py={20}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Container>
      <Flex
        py={20}
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Container className="container" size={1090}>
          <Grid className="grid" gutter={20}>
            <Grid.Col span={5}>
              <Carousel
                maw={400}
                withIndicators
                plugins={[autoplay.current]}
                onMouseEnter={autoplay.current.stop}
                onMouseLeave={autoplay.current.reset}
              >
                {slides}
              </Carousel>
            </Grid.Col>
            <Grid.Col span={7}>
              <div className="brandOrigin">
                Thương hiệu: {productDetail?.brandOrigin}
              </div>
              <div className="product-name grid">{productDetail?.name}</div>
              <Flex
                className="product-review grid"
                gap="md"
                align="center"
                direction="row"
                wrap="wrap"
                justify="flex-start"
              >
                <span>{productDetail?.registrationNumber}</span>
                <IconPointFilled size={12} />
                <span className="rating">
                  <span>5</span>
                  <span className="rating-start">
                    <ActionIcon color="yellow">
                      <IconStarFilled size={14} />
                    </ActionIcon>
                  </span>
                </span>
                <IconPointFilled size={12} />
                <span>1 đánh giá</span>
                <IconPointFilled size={12} />
                <span>3 bình luận</span>
              </Flex>
              <div className="product-price grid">
                <span className="price">
                  {productDetail &&
                    unitList &&
                    formatNumberWithCommas(
                      getSalePriceByUnitId(
                        productDetail.productUnits,
                        getIdByName(valueUnit, unitList)
                      )
                    )}
                  đ/
                </span>
                <span className="unit">{valueUnit}</span>
              </div>
              <div>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Chọn đơn vị tính
                  </Grid.Col>
                  <Grid.Col span={7}>
                    <Chip.Group
                      multiple={false}
                      value={valueUnit}
                      onChange={setValueUnit}
                    >
                      <Group>
                        {unitProductList &&
                          productDetail &&
                          unitList &&
                          unitProductList.map((item, index) => (
                            <Chip key={index} value={item}>
                              {item}
                            </Chip>
                          ))}
                      </Group>
                    </Chip.Group>
                  </Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Danh mục
                  </Grid.Col>
                  <Grid.Col span={7}>{productDetail?.category?.name}</Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Quy cách
                  </Grid.Col>
                  <Grid.Col span={7}>{productDetail?.packing}</Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Nước sản xuất
                  </Grid.Col>
                  <Grid.Col span={7}>{productDetail?.manufacturer}</Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Thành phần
                  </Grid.Col>
                  <Grid.Col span={7}>
                    {productDetail?.ingredients
                      .map((ingredient) => ingredient.name)
                      .join(", ")}
                  </Grid.Col>
                </Grid>
                {productDetail?.indications && (
                  <Grid className="grid" gutter={20}>
                    <Grid.Col className="gray" span={5}>
                      Chỉ định
                    </Grid.Col>
                    <Grid.Col span={7}>{productDetail?.indications}</Grid.Col>
                  </Grid>
                )}
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Mô tả ngắn
                  </Grid.Col>
                  <Grid.Col className="text" span={7}>
                    {(productDetail &&
                      (productDetail.shortDescription ||
                        productDetail.fullDescription)) ||
                      "Chưa có thông tin mô tả sản phẩm."}
                  </Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col className="gray" span={5}>
                    Chọn số lượng
                  </Grid.Col>
                  <Grid.Col span={7}>
                    <NumberInput
                      value={valueInput}
                      onChange={setValueInput}
                      defaultValue={1}
                      p={0}
                      withAsterisk
                      min={1}
                    />
                  </Grid.Col>
                </Grid>
                <Grid className="grid" gutter={20}>
                  <Grid.Col span={5}>
                    <Button
                      leftIcon={<IconShoppingCartFilled size="15px" />}
                      w={190}
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
                        if (unitList && valueInput && params.id) {
                          const newAddProductCart = {
                            productId: +params.id,
                            quantity: valueInput,
                            unitId: getIdByName(valueUnit, unitList),
                          };
                          onSubmit(newAddProductCart);
                        }
                      }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={7}>
                    <Button
                      w={190}
                      leftIcon={
                        <IconBuildingHospital strokeWidth="2.5" size="15px" />
                      }
                      variant="outline"
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
                      onClick={() => {
                        window.open("/nearest_branch", "_self");
                      }}
                    >
                      Tìm nhà thuốc
                    </Button>
                  </Grid.Col>
                  <Grid className="grid product-endow" py={10}>
                    <Grid.Col className="sub-endow" span={4}>
                      <Image mr={10} width={50} src={change} />
                      Đổi trả trong 30 ngày kể từ ngày mua hàng
                    </Grid.Col>
                    <Grid.Col className="sub-endow" span={4}>
                      <Image mr={10} width={50} src={free} />
                      Miễn phí 100% đổi thuốc
                    </Grid.Col>
                    <Grid.Col className="sub-endow" span={4}>
                      <Image mr={10} width={50} src={freeDelivery} />
                      Miễn phí vận chuyển theo chính sách giao hàng
                    </Grid.Col>
                  </Grid>
                </Grid>
              </div>
            </Grid.Col>
          </Grid>
        </Container>
        <Container size={1090} p={0} className="product-tabs container">
          <Tabs
            className="grid"
            defaultValue="description"
            orientation="vertical"
            miw={1090}
          >
            <Tabs.List>
              <Tabs.Tab py={20} pr={40} pl={20} value="description">
                Mô tả sản phẩm
              </Tabs.Tab>
              <Tabs.Tab py={20} pr={40} pl={20} value="ingredient">
                Thành phần
              </Tabs.Tab>
              <Tabs.Tab py={20} pr={40} pl={20} value="uses">
                Công dụng
              </Tabs.Tab>
              <Tabs.Tab py={20} pr={40} pl={20} value="usage">
                Cách dùng
              </Tabs.Tab>
              <Tabs.Tab py={20} pr={40} pl={20} value="sideEffects">
                Tác dụng phụ
              </Tabs.Tab>
              {productDetail && productDetail.notes && (
                <Tabs.Tab py={20} pr={40} pl={20} value="notes">
                  Lưu ý
                </Tabs.Tab>
              )}
              <Tabs.Tab py={20} pr={40} pl={20} value="storage">
                Bảo quản
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel p={20} value="description" className="text content-tab">
              <p className="panel-title">Mô tả sản phẩm</p>
              {(productDetail &&
                (productDetail.fullDescription ||
                  productDetail.shortDescription)) ||
                "Chưa có thông tin mô tả sản phẩm."}
            </Tabs.Panel>
            <Tabs.Panel p={20} className="content-tab" value="ingredient">
              <p className="panel-title">Thành phần</p>
              <Table horizontalSpacing="xl" striped highlightOnHover withBorder>
                <thead>
                  <tr>
                    <th>Thông tin thành phần</th>
                    <th>Hàm lượng</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </Table>
            </Tabs.Panel>
            <Tabs.Panel p={20} className="content-tab text" value="uses">
              <p className="panel-title">Công dụng</p>
              {productDetail?.uses}
            </Tabs.Panel>
            <Tabs.Panel p={20} className="content-tab text" value="usage">
              <p className="panel-title">Cách dùng</p>
              {productDetail?.usage}
            </Tabs.Panel>
            <Tabs.Panel p={20} className="content-tab text" value="sideEffects">
              <p className="panel-title">Tác dụng phụ</p>
              {productDetail?.sideEffects ||
                "Chưa có thông tin về tác dụng phụ của sản phẩm."}
            </Tabs.Panel>
            {productDetail && productDetail.notes && (
              <Tabs.Panel p={20} className="content-tab text" value="notes">
                <p className="panel-title">Lưu ý</p>
                <Alert
                  icon={<IconAlertCircle size="1rem" />}
                  title="Lưu ý"
                  color="red"
                >
                  {productDetail.notes}
                </Alert>
              </Tabs.Panel>
            )}
            <Tabs.Panel p={20} className="content-tab text" value="storage">
              <p className="panel-title">Bảo quản</p>
              {productDetail?.storage}
            </Tabs.Panel>
          </Tabs>
        </Container>
        <Container w="100%" mt="2rem" className="container" size={1090}>
          <Review
            id={productDetail?.id}
            name={productDetail?.name}
            image={productDetail?.images[0]}
          />
        </Container>
      </Flex>
    </>
  );
}

export default ProductDetail;
