import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { IFormInputs } from './type';
// import ButtonComp from "../UI/Button/Button";
import {
    Button,
    Modal,
    PasswordInput,
    TextInput,
    useMantineTheme,
} from '@mantine/core';
import useAuth from '../../hooks/useAuth';
import { notificationShow } from '../Notification';
import ButtonComp from '../UI/Button/Button';
import { handleGlobalException } from '../../utils/error';
import { useDisclosure } from '@mantine/hooks';

const RegisterForm: React.FC = ({ openModal }) => {
    const theme = useMantineTheme();
    // const [opened, { open, close }] = useDisclosure(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            username: '',
            password: '',
            email: '',
            phone: ''
        },
    });
    const { onSubmitRegister,
        handleRegister } = useAuth();
    const onSubmit: SubmitHandler<IFormInputs> = (data) => {
        onSubmitRegister(data, (error) => {
            handleGlobalException(error, () => {
                Object.keys(error.response.data).forEach((key) => {
                    setError(key, {
                        type: 'manual',
                        message: error.response.data[key],
                    });
                });
            })

        }

            , () => {
                openModal()
                // notificationShow('success', 'Success!', 'Đổi mật khẩu thành công!');
            }
        )
    }


    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="login-title">Đăng ký</div>
                <div className="sub-title">
                    Vui lòng đăng ký để hưởng những đặc quyền dành cho thành viên.
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
                        name="email"
                        control={control}
                        rules={{ required: true, pattern: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/ }}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                withAsterisk
                                // required
                                label="Địa chỉ email"
                                radius="md"
                                error={
                                    errors.email
                                        ? errors.email.type === 'pattern'
                                            ? 'Email không đúng định dạng (ex: user@example.com)'
                                            : errors.email.type === 'required'
                                                ? 'Thông tin bắt buộc. Vui lòng nhập đầy đủ.'
                                                : errors.email.message
                                        : false
                                }
                            />
                        )}
                    ></Controller>
                </div>
                <div className="controller">
                    <Controller
                        name="phone"
                        control={control}
                        rules={{ required: true, pattern: /^(03|05|07|09)\d{8}$/ }}
                        render={({ field }) => (
                            <TextInput
                                {...field}
                                // required
                                label="Số điện thoại"
                                withAsterisk
                                radius="md"
                                error={
                                    errors.phone
                                        ? errors.phone.type === 'pattern'
                                            ? 'Số điện thoại không đúng định dạng'
                                            : errors.phone.type === 'required'
                                                ? 'Thông tin bắt buộc. Vui lòng nhập đầy đủ.'
                                                : errors.phone.message
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
                    loading={handleRegister.isLoading}
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
                    ĐĂNG KÝ
                </Button>
            </form>


        </>

    );
};

export default RegisterForm;
