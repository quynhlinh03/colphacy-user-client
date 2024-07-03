import {
  Anchor,
  Breadcrumbs,
  Container,
  Flex,
  Tabs,
  Text,
  Image,
} from "@mantine/core";
import { IconMap, IconSearch } from "@tabler/icons-react";
import NearestBranch from "../components/Branch/NearestBranch";
import { DetailBranch } from "../components/Branch/DetailBranch";
import { useState } from "react";
import FindBranch from "../components/Branch/FindBranch";
import drugstore from "../assets/images/nhathuoc.svg";
import medicine from "../assets/images/thuoc.svg";
import ship from "../assets/images/giaohang.svg";
import pharmacist from "../assets/images/duocsi.svg";
import retail from "../assets/images/muale.svg";
import returns from "../assets/images/trahang.svg";

export default function Branch() {
  const [id, setId] = useState<number>();

  const handleValueChange = (newValue: number) => {
    setId(newValue);
  };

  const description = [
    {
      url: drugstore,
      title: "Nhà thuốc chính hãng",
      content:
        "Sở hữu danh mục thuốc chính hãng vừa đa dạng, phong phú lại vừa chuyên sâu.",
    },
    {
      url: medicine,
      title: "Chuyên thuốc theo toa",
      content:
        "Có đầy đủ các loại thuốc để có thể đáp đứng đầy đủ nhu cầu của người dùng.",
    },
    {
      url: pharmacist,
      title: "Dược sĩ tư vấn tại chỗ",
      content:
        "Với kinh nghiệm và chuyên môn cao với 4 tiêu chí: đúng thuốc, đúng liều, đúng cách và đúng giá.",
    },
    {
      url: retail,
      title: "Mua lẻ với giá sỉ",
      content:
        "Sản phẩm đúng chất lượng với giá thấp hơn so với thị trường chung, tương đương với giá bán sỉ.",
    },
    {
      url: ship,
      title: "Giao hàng tận nơi",
      content:
        "Giao hàng cực nhanh trong khu vực Tp.HCM và chuyển hàng đến tận nhà tại các tỉnh thành khác.",
    },
    {
      url: returns,
      title: "Đổi trả nguyên giá",
      content:
        "Chỉ cần đọc SĐT hoặc giữ lại hóa đơn, bạn sẽ được đổi trả / hoàn tiền đã mua trong vòng 30 ngày.",
    },
  ];

  return (
    <>
      <Container className="breadcrumbs" size={1200} pt={10} pb={15}>
        <Breadcrumbs>
          <Anchor href="/">Trang chủ</Anchor>
          <Text>Hệ thống nhà thuốc</Text>
        </Breadcrumbs>
      </Container>
      <Container maw={1200}>
        <Text className="title-ctn" py="1.5rem" fw={600} fz={16}>
          Hệ thống nhà thuốc trên toàn quốc
        </Text>

        <Flex
          justify="space-between"
          align="flex-start"
          direction="row"
          wrap="wrap"
        >
          <Container p={10} m={0} w={380} className="adv-filter">
            <Tabs defaultValue="find_branch">
              <Tabs.List position="apart">
                <Tabs.Tab
                  value="find_branch"
                  icon={<IconSearch size="0.8rem" />}
                >
                  Tìm kiếm nhà thuốc
                </Tabs.Tab>
                <Tabs.Tab
                  value="nearest_branch"
                  icon={<IconMap size="0.8rem" />}
                >
                  Nhà thuốc gần bạn
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="find_branch" pt="xs">
                <FindBranch id={id} onValueChange={handleValueChange} />
              </Tabs.Panel>
              <Tabs.Panel value="nearest_branch" pt="xs">
                <NearestBranch id={id} onValueChange={handleValueChange} />
              </Tabs.Panel>
            </Tabs>
          </Container>
          <Container p={10} m={0} w={770} className="adv-filter">
            {id ? <DetailBranch id={id} /> : <></>}
            <Container py={10}>
              <Text>
                Hệ thống nhà thuốc bán lẻ & phân phối trải khắp 63 tỉnh thành
                luôn luôn mở rộng để phục vụ Khách hàng trên toàn quốc, cung cấp
                dịch vụ bán hàng và phục vụ hàng đầu:
              </Text>
              <Flex
                py={20}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
              >
                {description.map((element, index) => {
                  return (
                    <Flex
                      w="48%"
                      gap="md"
                      key={index}
                      align="flex-start"
                      direction="row"
                      wrap="nowrap"
                    >
                      <Image width={20} src={element.url} />
                      <Flex
                        justify="space-between"
                        align="flex-start"
                        direction="column"
                        wrap="wrap"
                      >
                        <Text fw={500}>{element.title}</Text>
                        <Text>{element.content}</Text>
                      </Flex>
                    </Flex>
                  );
                })}
              </Flex>
            </Container>
          </Container>
        </Flex>
      </Container>
    </>
  );
}
