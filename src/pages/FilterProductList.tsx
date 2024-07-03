import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductItem from "../components/Product/ProductItem";
import {
  Accordion,
  Anchor,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Flex,
  Grid,
  Group,
  NumberInput,
  Text,
} from "@mantine/core";
import { handleGlobalException } from "../utils/error";
import { useProductList } from "../hooks/useProduct";
import { getNameById } from "../utils/common";
import { useListCategory } from "../hooks/useCategory";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IconChevronDown } from "@tabler/icons-react";
interface FilterProps {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: string;
  offset?: number;
  limit?: number;
  categoryIds: number;
  sortBy: string;
}
interface PriceProps {
  minPrice: number;
  maxPrice: number;
}

function FilterProductList() {
  const params = useParams();
  const [valueUnit, setValueUnit] = useState<string>("asc");
  const limitInit = 9;
  const [displayLimit, setDisplayLimit] = useState<number>(limitInit);
  let filterInit: FilterProps = {
    categoryIds: +params.id,
    order: valueUnit,
    sortBy: "SALE_PRICE",
    limit: displayLimit,
  };
  const [productList, setProductList] = useState<ProductListProp[]>();
  const [filter, setFilter] = useState<FilterProps>(filterInit);
  const { fetchProductList } = useProductList(filter);
  const { ListCategoryData } = useListCategory();
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { minPrice: 0, maxPrice: 0 },
  });

  const items = [
    { title: "Trang chủ", href: "/" },
    {
      title: `${
        params.id &&
        ListCategoryData?.data &&
        getNameById(+params.id, ListCategoryData.data)
      }`,
      href: "#",
    },
  ].map((item, index) => (
    <Anchor href={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const fetchMoreProducts = () => {
    setDisplayLimit((prevLimit) => prevLimit + limitInit);
  };

  useEffect(() => {
    setFilter({
      categoryIds: +params.id,
      sortBy: "SALE_PRICE",
      order: valueUnit,
      minPrice: getValues("minPrice"),
      maxPrice: getValues("maxPrice"),
      limit: displayLimit,
    });
  }, [
    displayLimit,
    getValues("minPrice"),
    getValues("maxPrice"),
    valueUnit,
    params.id,
  ]);

  useEffect(() => {
    async function fetchProductListData() {
      const data = await fetchProductList.refetch();

      if (data.isSuccess) {
        setProductList(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {
          setError("minPrice", {
            type: "manual",
            message: error.response.data.minPrice,
          });
          setError("maxPrice", {
            type: "manual",
            message: error.response.data.maxPrice,
          });
        });
      }
    }
    fetchProductListData();
  }, [params.id, filter]);

  const onSubmit: SubmitHandler<PriceProps> = (data) => {
    setValue("minPrice", data.minPrice);
    setValue("maxPrice", data.maxPrice);
  };

  return (
    <>
      <Container className="breadcrumbs" size={1090} pt={10} pb={15}>
        <Breadcrumbs>{items}</Breadcrumbs>
      </Container>
      <Container maw={1090}>
        <Grid
          className="title-ctn"
          justify="space-between"
          align="center"
          py="1.5rem"
        >
          <Grid.Col span={4}>
            <Text className="list-product-title">Danh sách sản phẩm</Text>
          </Grid.Col>
          <Grid.Col span={8}>
            <Flex gap="lg" justify="flex-end">
              <Text>Sắp xếp theo</Text>
              <Chip.Group
                multiple={false}
                value={valueUnit}
                onChange={setValueUnit}
              >
                <Group>
                  {/* <Chip value="sold">Bán chạy</Chip> */}
                  <Chip value="asc">Giá thấp</Chip>
                  <Chip value="desc">Giá cao</Chip>
                  {/* <Chip value="rating">Đánh giá</Chip> */}
                </Group>
              </Chip.Group>
            </Flex>
          </Grid.Col>
        </Grid>
        <Grid justify="center">
          <Grid.Col className="adv-filter" span={3}>
            <Text p={10} fw={500}>
              Bộ lọc nâng cao
            </Text>
            <Accordion disableChevronRotation defaultValue="customization">
              <Accordion.Item value="sale-price">
                <Accordion.Control fz={14}>Giá bán</Accordion.Control>
                <Accordion.Panel>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                      name="minPrice"
                      rules={{
                        required: true,
                      }}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          label="Từ"
                          p={5}
                          withAsterisk
                          error={
                            errors.minPrice
                              ? errors.minPrice.type === "required"
                                ? "Vui lòng nhập khoảng giá hợp lệ"
                                : errors.minPrice.message
                              : false
                          }
                        />
                      )}
                    ></Controller>

                    <Controller
                      name="maxPrice"
                      rules={{
                        required: true,
                      }}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          {...field}
                          label="Đến"
                          p={5}
                          withAsterisk
                          error={
                            errors.maxPrice
                              ? errors.maxPrice.type === "required"
                                ? "Vui lòng nhập khoảng giá hợp lệ"
                                : errors.maxPrice.message
                              : false
                          }
                        />
                      )}
                    ></Controller>
                    <Button
                      className="login-button"
                      mx={5}
                      my={10}
                      type="submit"
                      styles={(theme) => ({
                        root: {
                          backgroundColor: theme.colors.munsellBlue[0],
                        },
                      })}
                    >
                      Áp dụng
                    </Button>
                  </form>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Grid.Col>

          <Grid.Col span={9}>
            <Container className="list-ctn">
              <div className="list-filter-product">
                {productList &&
                  productList.items &&
                  productList.items.map((item, index) => {
                    return (
                      <ProductItem
                        id={item.id}
                        key={index}
                        name={item.name}
                        price={item.salePrice}
                        images={item.image}
                        unit={item.unitName}
                        unitId={item.unitId}
                      />
                    );
                  })}
              </div>
              {productList && productList.limit < productList.totalItems && (
                <div className="read-more" onClick={fetchMoreProducts}>
                  <IconChevronDown className="icondown" size={16} />
                  Xem thêm
                </div>
              )}
              {productList?.items.length === 0 && <Text>Chưa có sản phẩm</Text>}
            </Container>
          </Grid.Col>
        </Grid>
      </Container>
    </>
  );
}

export default FilterProductList;
