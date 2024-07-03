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
import LoginForm from './LoginForm';
import { useState } from 'react';
import RegisterForm from './RegisterForm';
import { useDisclosure } from '@mantine/hooks';

const AuthForm: React.FC = ({ closeModal }) => {
    const [register, setRegister] = useState(false)
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <div className="modal" >
                {register ? <RegisterForm openModal={closeModal}></RegisterForm> : <LoginForm />}

                {register ? <div className="signin-title">
                    <span>Đã có tài khoản?</span>
                    <p onClick={() => setRegister(false)}> Đăng nhập</p>
                </div> : <div className="signin-title">
                    <span>Chưa có tài khoản?</span>
                    <p onClick={() => setRegister(true)}> Đăng ký ngay</p>
                </div>}


            </div>

        </>

    );
};

export default AuthForm;
