import { useParams } from "react-router-dom";
import axios from "../settings/axios";
import { useQuery } from "@tanstack/react-query";
import { Flex, Text, Anchor, Image, Center } from "@mantine/core";
import successImg from "../assets/images/success.png";
import failImg from "../assets/images/fail.png";

function Success() {
  return (
    <Center m={100}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Image width={80} height={80} src={successImg} />
        <Text fw={600} fz={20}>
          Xác nhận đăng ký thành công !
        </Text>
        <Text fw={400} fz={16}>
          Bạn đã đăng ký thành công tài khoản sử dụng Hệ thống nhà thuốc
          Colphacy. Đi đến{" "}
          <Anchor
            href="https://colphacy-user-client.vercel.app/"
            target="_blank"
          >
            trang web
          </Anchor>{" "}
          để sử dụng.
        </Text>
      </Flex>
    </Center>
  );
}

function Fail() {
  return (
    <Center m={100}>
      <Flex
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Image width={80} height={80} src={failImg} />
        <Text fw={600} fz={20}>
          Có lỗi xảy ra !
        </Text>
        <Text fw={400} fz={16}>
          Đã có lỗi xảy ra. Vui lòng thử lại sau.
        </Text>
      </Flex>
    </Center>
  );
}
export default function VerifyAccount() {
  const params = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ["get-detail-branch"],
    queryFn: () => {
      return axios.get(`/auth/verifyEmail?token=${params.token}`);
    },
  });
  if (isLoading) return "Loading...";
  return data ? (
    <h1>
      <Success />
    </h1>
  ) : (
    <Fail />
  );
}
