import { useEffect, useState } from "react";
import { handleGlobalException } from "../utils/error";
import { notificationShow } from "../components/Notification";
import {
  Button,
  Center,
  Flex,
  Select,
  TextInput,
  Text,
  Container,
} from "@mantine/core";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import useUserProfile from "../hooks/useUserProfile";
import { Account } from "../types/Account";

export function Profile() {
  const {
    fetchUserProfile,
    onSubmitProfileForm,
    handleUpdateProfile,
    updateUserProfile,
  } = useUserProfile();
  const [isEdit, setIsEdit] = useState(false);
  const [data, setData] = useState<Account>();
  async function fetchData() {
    const data = await fetchUserProfile.refetch();
    if (data.isSuccess) {
      const result = data.data.data;
      setData(result);
      Object.keys(result).forEach((key) => {
        setValue(key, result[key]);
      });
      updateUserProfile(result);
    } else if (data.isError) {
      const error = data.error;
      handleGlobalException(error, () => {
        if (error.response.status === 400) {
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            notificationShow("error", "Error!", data[key]);
          });
        }
      });
    }
  }
  const handleCancel = () => {
    fetchData();
    setIsEdit(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      id: -1,
      fullName: "",
      username: "",
      phone: "",
      gender: "",
      email: "",
      active: true,
    },
  });
  const onSubmit: SubmitHandler<Account> = (data) => {
    onSubmitProfileForm(
      data,
      () => {
        fetchData();
        notificationShow(
          "success",
          "Success!",
          "Cập nhật thông tin thành công!"
        );
        setIsEdit(false);
      },
      (error) => {
        handleGlobalException(error, () => {
          Object.keys(error.response.data).forEach((key) => {
            setError(key, {
              type: "manual",
              message: error.response.data[key],
            });
          });
        });
      }
    );
  };
  return (
    <Container className="personal-ctn">
      <Text fz={16} fw={500}>
        Thông tin cá nhân
      </Text>
      {!isEmpty(data) && (
        <form
          className="employee-account-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Flex
            direction="column"
            gap="lg"
            style={{
              width: "24vw",
              margin: "auto",
              marginTop: "3%",
              padding: "1rem",
            }}
          >
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Họ tên"
                  radius="md"
                  required
                  style={!isEdit ? { pointerEvents: "none" } : {}}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  error={errors.fullName ? errors.fullName.message : false}
                />
              )}
            ></Controller>
            <Controller
              name="username"
              control={control}
              rules={{ required: true, minLength: 6 }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label="Tên đăng nhập"
                  radius="md"
                  required
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  style={!isEdit ? { pointerEvents: "none" } : {}}
                  error={
                    errors.username
                      ? errors.username.type === "minLength"
                        ? "Tên tài khoản có độ dài ít nhất 6 kí tự"
                        : errors.username.message
                      : false
                  }
                />
              )}
            ></Controller>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={{ pointerEvents: "none" }}
                  disabled={isEdit}
                  label="SĐT"
                  radius="md"
                />
              )}
            ></Controller>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Giới tính"
                  data={[
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                    { value: 'OTHER', label: 'Khác' },
                  ]}
                  style={!isEdit ? { pointerEvents: "none" } : {}}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              )}
            ></Controller>
            <Controller
              name="email"
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => (
                <TextInput
                  disabled={isEdit}
                  {...field}
                  style={{ pointerEvents: "none" }}
                  label="Email"
                  radius="md"
                />
              )}
            ></Controller>
            {isEdit ? (
              <Flex
                direction={{ base: "column", sm: "row" }}
                gap={{ base: "sm", sm: "lg" }}
                justify={{ sm: "center" }}
              >
                <Button
                  loading={handleUpdateProfile.isLoading}
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
                  Lưu
                </Button>
                <Button
                  styles={(theme) => ({
                    root: {
                      color: theme.colors.munsellBlue[0],
                      background: theme.white,
                      borderColor: theme.colors.munsellBlue[0],
                      ...theme.fn.hover({
                        backgroundColor: theme.fn.darken(theme.white, 0.05),
                      }),
                    },
                  })}
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              </Flex>
            ) : (
              <Center>
                <Button
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
                    setIsEdit(true);
                  }}
                >
                  Chỉnh sửa thông tin
                </Button>
              </Center>
            )}
          </Flex>
        </form>
      )}
    </Container>
  );
}
