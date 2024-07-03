import {
  Button,
  Flex,
  useMantineTheme,
  Text,
  PinInput,
  Center,
  Group,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFormInputs } from "./type";
import ButtonComp from "../UI/Button/Button";

const OTPForm: React.FC<{ onMethodLogin: () => void }> = (props) => {
  const theme = useMantineTheme();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    ;
    // login.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-title">Nhập mã xác thực</div>
      <div className="sub-title">Vui lòng nhập mã xác thực.</div>
      <Flex direction="column" gap="md">
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <Group position="center">
              <PinInput {...field} type="number" length={6} />
            </Group>
          )}
        ></Controller>
        <ButtonComp content="Xác nhận" />
        <div className="forgotPass-ctn">
          <a>Gửi lại mã cho tôi</a>
          <a
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              props.onMethodLogin();
            }}
          >
            Đổi số điện thoại
          </a>
        </div>
      </Flex>
    </form>
  );
};

export default OTPForm;
