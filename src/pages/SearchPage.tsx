import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductItem from '../components/Product/ProductItem';
import {
  Accordion,
  Button,
  Chip,
  Container,
  Flex,
  Grid,
  Group,
  NumberInput,
  Text,
} from '@mantine/core';
import { handleGlobalException } from '../utils/error';
import { useProductList } from '../hooks/useProduct';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IconChevronDown } from '@tabler/icons-react';
import { isEmpty } from 'lodash';
interface FilterProps {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: string;
  offset?: number;
  limit?: number;
  categoryIds?: number;
  sortBy: string;
}
interface PriceProps {
  minPrice: number;
  maxPrice: number;
}

function SearchPage() {
  const [queryParameters] = useSearchParams();
  const [valueUnit, setValueUnit] = useState<string>('asc');
  const limitInit = 9;
  const [displayLimit, setDisplayLimit] = useState<number>(limitInit);
  let filterInit: FilterProps = {
    keyword: queryParameters.get('keyword') || '',
    order: valueUnit,
    sortBy: 'SALE_PRICE',
    limit: displayLimit,
  };
  const [productList, setProductList] = useState<ProductListProp[]>();
  const [filter, setFilter] = useState<FilterProps>(filterInit);
  const { fetchProductList } = useProductList(filter);
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

  const fetchMoreProducts = () => {
    setDisplayLimit((prevLimit) => prevLimit + limitInit);
  };

  useEffect(() => {
    setFilter({
      keyword: queryParameters.get('keyword') || '',
      sortBy: 'SALE_PRICE',
      order: valueUnit,
      minPrice: getValues('minPrice'),
      maxPrice: getValues('maxPrice'),
      limit: displayLimit,
    });
  }, [
    getValues('minPrice'),
    getValues('maxPrice'),
    valueUnit,
    displayLimit,
    queryParameters.get('keyword'),
  ]);
  async function fetchProductListData() {
    const data = await fetchProductList.refetch();
    if (data.isSuccess) {
      setProductList(data.data.data);
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => {
        setError('minPrice', {
          type: 'manual',
          message: error.response.data.minPrice,
        });
        setError('maxPrice', {
          type: 'manual',
          message: error.response.data.maxPrice,
        });
      });
    }
  }

  useEffect(() => {
    if (!isEmpty(queryParameters.get('keyword'))) fetchProductListData();
  }, [filter]);

  const onSubmit: SubmitHandler<PriceProps> = () => {
    fetchProductListData();
  };

  return (
    <>
      <Container maw={1090}>
        <Grid
          className="title-ctn"
          justify="space-between"
          align="center"
          py="2rem"
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
                  <Chip value="asc">Giá thấp</Chip>
                  <Chip value="desc">Giá cao</Chip>
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
                          parser={(value) => value.replace(/[^\d.]/g, '')}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? `${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ',',
                                )
                              : ''
                          }
                          error={
                            errors.minPrice
                              ? errors.minPrice.type === 'required'
                                ? 'Vui lòng nhập khoảng giá hợp lệ'
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
                          parser={(value) => value.replace(/[^\d.]/g, '')}
                          formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                              ? `${value}`.replace(
                                  /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
                                  ',',
                                )
                              : ''
                          }
                          error={
                            errors.maxPrice
                              ? errors.maxPrice.type === 'required'
                                ? 'Vui lòng nhập khoảng giá hợp lệ'
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

export default SearchPage;
