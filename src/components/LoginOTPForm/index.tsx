import {
  Button,
  Flex,
  TextInput,
  useMantineTheme,
  Text,
  Center,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { IFormInputs } from "./type";
import ButtonComp from "../UI/Button/Button";
// import useAuth from "../../hooks/useAuth";
// import { useState } from "react";

const LoginOTPForm: React.FC<{
  onMethodChange: () => void;
  onMethodLogin: () => void;
}> = (props) => {
  //   const [error, setError] = useState({});
  const { control, handleSubmit } = useForm({
    defaultValues: {
      phoneNumber: "",
    },
  });
  // const { login } = useAuth();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    ;
    // login.mutate(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-title">Đăng nhập</div>
      <div className="sub-title">
        Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.
      </div>
      <Flex direction="column" gap="md">
        <Controller
          name="phoneNumber"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextInput
              {...field}
              required
              label="Số điện thoại"
              radius="md"
              error=""
            />
          )}
        ></Controller>
        <a
          className="loginPass"
          href="/"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            props.onMethodChange();
          }}
        >
          Đăng nhập bằng mật khẩu
        </a>
        <ButtonComp onMethodChange={props.onMethodLogin} content="Đăng nhập" />

        <div className="signin-title">
          <span>Chưa có tài khoản?</span>
          <a href="/"> Đăng ký ngay</a>
        </div>
      </Flex>
    </form>
  );
};

export default LoginOTPForm;
