import {
  Divider,
  Text,
  Image,
  Flex,
  Modal,
  Grid,
  Rating,
  Container,
  Center,
} from "@mantine/core";
import Star from "../../assets/images/star.png";
import { useDisclosure } from "@mantine/hooks";
import { ReviewForm } from "./ReviewForm/ReviewForm";
import { useEffect } from "react";
import { useListReview } from "../../hooks/useReview";
import adminAva from "../../assets/images/adminAva.png";
import userAva from "../../assets/images/userAva.png";
import { IconChevronsDown } from "@tabler/icons-react";
import React from "react";

interface ReviewItemProps {
  ava: string;
  item: ReviewItem;
}
function convertDateTime(dateTimeStr: string) {
  const date = new Date(dateTimeStr);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")} ${date
    .getDate()
    .toString()
    .padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;

  return formattedDate;
}
function ReviewItem({ ava, item }: ReviewItemProps) {
  return (
    <Grid>
      <Grid.Col span="content">
        <Image width={44} src={ava} />
      </Grid.Col>
      <Grid.Col span="auto">
        <Flex
          gap={5}
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Text fz={14} fw={500} className="review-name">
            {item.reviewerName}
          </Text>
          {item.rating && (
            <Text>
              <Rating readOnly defaultValue={item.rating} />
            </Text>
          )}
          <Text fz={14} fw={400} className="review-content">
            {item.content}
          </Text>
          <Text fz={12} fw={400} className="review-time">
            {convertDateTime(item.createdTime)}
          </Text>
        </Flex>
      </Grid.Col>
    </Grid>
  );
}
export const Review: React.FC<ReviewForm> = ({ name, image, id }) => {
  // const ratings = {
  //   average: 5,
  //   total: 10,
  //   detail: [
  //     { rating: 5, count: 3 },
  //     { rating: 4, count: 2 },
  //     { rating: 3, count: 1 },
  //     { rating: 2, count: 2 },
  //     { rating: 1, count: 2 },
  //   ],
  // };

  const [opened, { open, close }] = useDisclosure(false);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useListReview(
      {
        offset: 0,
        limit: 3,
      },
      id
    );
  const onSuccesSubmitAdd = () => {
    close;
  };
  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);
  return (
    <>
      <Flex
        gap="sm"
        justify="flex-start"
        align="center"
        direction="row"
        wrap="wrap"
      >
        <Text fz={16} fw={600}>
          Đánh giá sản phẩm
        </Text>
        <Text fz={14} fw={400} className="review-content">
          ( {data?.pages[0].data.totalItems} đánh giá )
        </Text>
      </Flex>
      <Divider my="xs" />
      {data?.pages[0].data.totalItems === 0 && (
        <Flex gap="xl" justify="center" align="center" direction="column">
          <Image width="10rem" src={Star}></Image>
          <Text>
            Hãy sử dụng sản phẩm và trở thành người đầu tiên đánh giá trải
            nghiệm nha.
          </Text>
          {/* <Button
            onClick={open}
            radius="xl"
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
            Gửi đánh giá
          </Button> */}
        </Flex>
      )}
      {!(data?.pages[0].data.totalItems === 0) && (
        <Container m={0} px={0}>
          {/* <Grid>
      <Grid.Col span={3}>
        <Flex
          gap="lg"
          justify="center"
          align="flex-start"
          direction="column"
          wrap="wrap"
        >
          <Text>Trung Bình</Text>
          <Text>
            5 <Rating count={1} />{" "}
          </Text>
        </Flex>
      </Grid.Col>
      <Grid.Col span={6}>
        <Flex gap="sm" justify="center" align="center" direction="column">
          {ratings.detail.map((item, index) => {
            console.log("ne", (item.count * 100) / ratings.total);
            return (
              <Flex key={index}>
                <Rating defaultValue={item.rating} />
                <Slider
                  defaultValue={(item.count * 100) / ratings.total}
                />
                <Text>{item.count}</Text>
              </Flex>
            );
          })}
        </Flex>
      </Grid.Col>
    </Grid> */}
          {data?.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.items.map((item, index) => (
                <Container m={0} px={0} py={20} key={index}>
                  <ReviewItem ava={userAva} item={item} />
                  {item.childReview && (
                    <Container m={10} py={10} pl="3rem" key={index}>
                      <ReviewItem ava={adminAva} item={item.childReview} />
                    </Container>
                  )}
                </Container>
              ))}
            </React.Fragment>
          ))}
          <div style={{ cursor: "pointer", color: "#00439c" }}>
            <Center p={8} onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? (
                "Đang tải..."
              ) : hasNextPage ? (
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
        </Container>
      )}

      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Đánh giá sản phẩm"
        styles={() => ({
          title: {
            fontWeight: "bold",
          },
        })}
      >
        <ReviewForm
          onSuccesSubmitAdd={() => onSuccesSubmitAdd}
          id={id}
          name={name}
          image={image}
        />
      </Modal>
    </>
  );
};
