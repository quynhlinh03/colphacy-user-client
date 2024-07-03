import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { IFormInputs } from './type';
// import ButtonComp from "../UI/Button/Button";
import {
  Button,
  PasswordInput,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import useAuth from '../../hooks/useAuth';
import { notificationShow } from '../Notification';
import ButtonComp from '../UI/Button/Button';
import { handleGlobalException } from '../../utils/error';

const LoginForm: React.FC = (props) => {
  const theme = useMantineTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });
  const { onSubmitAccountForm, handleLoginPassword } = useAuth();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    onSubmitAccountForm(data, (error) => {
      handleGlobalException(error, () => {
        if (error.response.status === 400) {
          const data = error.response.data;
          Object.keys(data).forEach((key) => {
            notificationShow("error", "Error!", data[key]);
          });
        }
      })
      // if (error.code === 'ERR_NETWORK') {
      //   notificationShow('error', 'Error!', error.message);
      // } else if (error.response.status === 500) {
      //   notificationShow('error', 'Error!', error.response.data.error);
      // } else {
      //   setError('username', {
      //     type: 'manual',
      //     message:
      //       error.response.status === 404 ? true : error.response.data.username,
      //   });
      //   setError('password', {
      //     type: 'manual',
      //     message:
      //       error.response.status === 404
      //         ? error.response.data.error
      //         : error.response.data.password,
      //   });
      // }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-title">Đăng nhập</div>
      <div className="sub-title">
        Vui lòng đăng nhập để hưởng những đặc quyền dành cho thành viên.
      </div>
      <div className="controller">
        <Controller
          name="username"
          control={control}
          rules={{ required: true, minLength: 6 }}
          render={({ field }) => (
            <TextInput
              {...field}
              withAsterisk
              // required
              label="Tên tài khoản"
              radius="md"
              error={
                errors.username
                  ? errors.username.type === 'minLength'
                    ? 'Tên tài khoản có độ dài ít nhất 6 kí tự'
                    : errors.username.type === 'required'
                      ? 'Thông tin bắt buộc. Vui lòng nhập đầy đủ.'
                      : errors.username.message
                  : false
              }
            />
          )}
        ></Controller>
      </div>
      <div className="controller">
        <Controller
          name="password"
          control={control}
          rules={{ required: true, minLength: 8 }}
          render={({ field }) => (
            <PasswordInput
              {...field}
              // required
              label="Mật khẩu"
              withAsterisk
              radius="md"
              error={
                errors.password
                  ? errors.password.type === 'minLength'
                    ? 'Mật khẩu có độ dài ít nhất 8 kí tự'
                    : errors.password.type === 'required'
                      ? 'Thông tin bắt buộc. Vui lòng nhập đầy đủ.'
                      : errors.password.message
                  : false
              }
            />
          )}
        ></Controller>
      </div>

      <Button
        className="buttoncomp-ctn"
        loading={handleLoginPassword.isLoading}
        styles={(theme) => ({
          root: {
            backgroundColor: theme.colors.munsellBlue[0],
            ...theme.fn.hover({
              backgroundColor: theme.fn.darken(
                theme.colors.munsellBlue[0],
                0.1,
              ),
            }),
          },
        })}
        type="submit"
      >
        {' '}
        ĐĂNG NHẬP
      </Button>
    </form>
  );
};

export default LoginForm;
