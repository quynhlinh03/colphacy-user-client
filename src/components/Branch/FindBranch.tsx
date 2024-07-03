import { useEffect, useRef, useState } from "react";
import { handleGlobalException } from "../../utils/error";
import {
  Center,
  Container,
  Divider,
  Flex,
  Radio,
  Select,
  Text,
} from "@mantine/core";
import { IconChevronsDown, IconSearch } from "@tabler/icons-react";
import { useFindBranch } from "../../hooks/useBranch";
import React from "react";

interface FindBranchProps {
  id?: number;
  onValueChange: (newValue: number) => void;
}
function formatProvincesDistricts(
  branchesProvinces: { slug: string; name: string }[]
) {
  return branchesProvinces.map((province) => ({
    value: province.slug,
    label: province.name,
  }));
}

export default function FindBranch({ onValueChange, id }: FindBranchProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [provinceSlug, setProvinceSlug] = useState("");
  const [districtSlug, setDistrictSlug] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [branchesProvinces, setBranchesProvinces] = useState([]);
  const [branchesDistricts, setBranchesDistricts] = useState([]);
  const formattedProvinces = formatProvincesDistricts(branchesProvinces);
  const formattedDistricts = formatProvincesDistricts(branchesDistricts);
  const filter = {
    offset: 0,
    limit: 5,
    province: provinceSlug,
    district: districtSlug,
  };
  const search = {
    offset: 0,
    limit: 5,
    keyword: searchValue,
  };
  const [filterArr, setFilterArr] = useState(filter);
  const [searchArr, setSearchArr] = useState(search);
  const {
    dataFilter,
    errorFilter,
    fetchNextPageFilter,
    hasNextPageFilter,
    isFetchingNextPageFilter,
    statusFilter,
    refetchFilter,
    dataSearch,
    errorSearch,
    fetchNextPageSearch,
    hasNextPageSearch,
    isFetchingNextPageSearch,
    statusSearch,
    refetchSearch,
    fetchBranchProvinces,
    fetchBranchDistricts,
  } = useFindBranch(search, filter, provinceSlug);
  const handleProvincesChange = (value: string) => {
    setProvinceSlug(value);
    setDistrictSlug("");
    setSearchValue("");
  };
  const handleDistrictsChange = (value: string) => {
    setDistrictSlug(value);
    setSearchValue("");
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
      setProvinceSlug("");
      setDistrictSlug("");
      setBranchesDistricts([]);
    }
  };
  useEffect(() => {
    setFilterArr({
      offset: 0,
      limit: 5,
      province: provinceSlug,
      district: districtSlug,
    });
  }, [districtSlug, provinceSlug]);
  useEffect(() => {
    setSearchArr({
      offset: 0,
      limit: 5,
      keyword: searchValue,
    });
  }, [searchValue]);
  useEffect(() => {
    if (id) {
      setValue(id.toString());
    }
  }, [id]);
  useEffect(() => {
    refetchFilter();
    if (searchArr.keyword) {
      refetchSearch();
    }
  }, [filterArr, searchArr]);
  useEffect(() => {
    if (provinceSlug === null) {
      setBranchesDistricts([]);
    }
    async function fetchProvincesData() {
      const data = await fetchBranchProvinces.refetch();
      if (data.isSuccess) {
        setBranchesProvinces(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    fetchProvincesData();
    async function fetchDistrictsData() {
      const data = await fetchBranchDistricts.refetch();
      if (data.isSuccess) {
        setBranchesDistricts(data.data.data);
      } else if (data.isError) {
        const error = data.error;
        handleGlobalException(error, () => {});
      }
    }
    if (provinceSlug) {
      fetchDistrictsData();
    }
  }, [provinceSlug]);

  return (
    <>
      <Flex className="branch-search-ctn" p={10} gap="xs" direction={"column"}>
        <Flex className="branch-search" justify="space-between">
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Tìm bằng tên đường hoặc tỉnh thành..."
            spellCheck={false}
            onChange={handleChange}
          />
          <button
            className="branch-search-btn"
            onMouseDown={(e) => e.preventDefault()}
          >
            <IconSearch size="1.3rem"></IconSearch>
          </button>
        </Flex>
        <Divider my="xs" label="hoặc" labelPosition="center" />
        <Flex gap="xs">
          <Select
            placeholder="Tỉnh/ Thành"
            data={formattedProvinces}
            onChange={handleProvincesChange}
            value={provinceSlug}
            clearable
          />
          <Select
            placeholder="Quận/ Huyện"
            data={formattedDistricts}
            onChange={handleDistrictsChange}
            value={districtSlug}
            clearable
          />
        </Flex>
      </Flex>
      <Text fz={13} px={15} py={10} style={{ color: "#4a4f63" }}>
        {searchValue || provinceSlug || districtSlug
          ? "Kết quả tìm kiếm"
          : "Danh sách nhà thuốc"}
      </Text>
      {searchValue ? (
        <>
          {statusSearch === "loading" ? (
            <Text fz={13} px={15} py={10}>
              Đang tải...
            </Text>
          ) : statusSearch === "error" ? (
            <Text fz={13} px={15} py={10}>
              Error: {errorSearch.message}
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
                {dataSearch.pages.map((group, i) => (
                  <React.Fragment key={i}>
                    {!group.data.items.length && (
                      <Center pt={5}>Không có kết quả phù hợp</Center>
                    )}
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
                  <Center p={8} onClick={() => fetchNextPageSearch()}>
                    {isFetchingNextPageSearch ? (
                      "Đang tải..."
                    ) : hasNextPageSearch ? (
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
        <>
          {statusFilter === "loading" ? (
            <Text fz={13} px={15} py={10}>
              Đang tải...
            </Text>
          ) : statusFilter === "error" ? (
            <Text fz={13} px={15} py={10}>
              Error: {errorFilter.message}
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
                {dataFilter.pages.map((group, i) => (
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
                  <Center p={8} onClick={() => fetchNextPageFilter()}>
                    {isFetchingNextPageFilter ? (
                      "Đang tải..."
                    ) : hasNextPageFilter ? (
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
      )}
    </>
  );
}
