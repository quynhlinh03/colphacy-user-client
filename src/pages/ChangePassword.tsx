import {
  Button,
  Center,
  Container,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { handleGlobalException } from "../utils/error";

export interface IFormInputs {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function ChangePassword() {
  const { handleChangePassword, onSubmitChangePassword, isAuthenticated } =
    useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    onSubmitChangePassword(data, (error) => {
      handleGlobalException(error, () => {
        Object.keys(error.response.data).forEach((key) => {
          setError(key, {
            type: "manual",
            message: error.response.data[key],
          });
        });
      });
    });
  };
  return (
    <Container className="personal-ctn">
      <Text fz={16} fw={500}>
        Đổi mật khẩu
      </Text>
      {isAuthenticated && (
        <Center>
          <Paper
            my="3rem"
            shadow="sm"
            p="md"
            withBorder
            w="500px"
            className="login-container"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex direction="column" gap="xs">
                <Controller
                  name="oldPassword"
                  control={control}
                  rules={{ required: false, minLength: 8 }}
                  render={({ field }) => (
                    <PasswordInput
                      width={"100%"}
                      {...field}
                      required
                      label="Mật khẩu hiện tại"
                      radius="md"
                      error={
                        errors.oldPassword
                          ? errors.oldPassword.type === "minLength"
                            ? "Mậ khẩu có độ dài ít nhất 8 kí tự"
                            : errors.oldPassword.message
                          : false
                      }
                    />
                  )}
                ></Controller>
                <Controller
                  name="newPassword"
                  control={control}
                  rules={{ required: true, minLength: 8 }}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      required
                      label="Mật khẩu mới"
                      radius="md"
                      error={
                        errors.newPassword
                          ? errors.newPassword.type === "minLength"
                            ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                            : errors.newPassword.message
                          : false
                      }
                    />
                  )}
                ></Controller>
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{ required: true, minLength: 8 }}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      required
                      label="Mật khẩu mới"
                      radius="md"
                      error={
                        errors.confirmPassword
                          ? errors.confirmPassword.type === "minLength"
                            ? "Mật khẩu có độ dài ít nhất 8 kí tự"
                            : errors.confirmPassword.message
                          : false
                      }
                    />
                  )}
                ></Controller>
                <Button
                  m={"auto"}
                  loading={handleChangePassword.isLoading}
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
                  ĐỔI MẬT KHẨU
                </Button>
                {/* <Flex justify="space-between">
                      <Text className="option" color={theme.colors.munsellBlue[0]} >Quên mật khẩu</Text>
                      <Text className="option" color={theme.colors.munsellBlue[0]} onClick={props.onMethodChange}>Đăng nhập bằng OTP</Text>
                  </Flex> */}
              </Flex>
            </form>
          </Paper>
        </Center>
      )}
    </Container>
  );
}
export default ChangePassword;
