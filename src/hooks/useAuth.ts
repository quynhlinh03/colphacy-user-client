import { REQUEST_AUTH_LOGIN_PASSWORD,REQUEST_AUTH_LOGOUT, REQUEST_CHANGE_PASSWORD } from "./../constants/apis";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../store/AuthStore";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import { notificationShow } from "../components/Notification";
import { CHANGE_PASSWORD } from "../constants/routes";

function useAuth() {
  const { login, userProfile,logout } = useAuthStore();
  const isAuthenticated = !isEmpty(userProfile);
  const navigate = useNavigate();
  const handleLoginPassword = useMutation({
    mutationKey: ['login'],
    mutationFn: (data) => {
      return axios.post(REQUEST_AUTH_LOGIN_PASSWORD, data);
    },
  });

  const onSubmitAccountForm = (
    data: { username: string; password: string },
    onError: (error: object) => void,
  ) => {
    handleLoginPassword.mutate(data, {
      onSuccess: (data) => {
        login(data.data.accessToken, data.data.userProfile,data.data.expirationTime);        // navigate(HOME);
        notificationShow('success', 'Success!', 'Đăng nhập thành công!');
      },
      onError: (error) => onError(error),
    });
  };
  const handleLogout = useMutation({
    mutationKey: ['logout'],
    mutationFn: () => {
      logout();
      return axios.post(REQUEST_AUTH_LOGOUT);
    },
    // onSuccess: () => {
    //   logout();
    // },
    // onError: (error) => {
    //   notificationShow('error', 'Error!', error.message);
    // },
  });

  const handleChangePassword = useMutation({
    mutationKey: ['chnage-password'],
    mutationFn: (data) => {
      return axios.put(REQUEST_CHANGE_PASSWORD, data);
    },
  });
  const onSubmitChangePassword = (
    data: { oldPassword: string; newPassword: string; confirmPassword: string },
    onError: (error: object) => void,
  ) => {
    handleChangePassword.mutate(data, {
      onSuccess: () => {
        navigate(CHANGE_PASSWORD);
        notificationShow('success', 'Success!', 'Đổi mật khẩu thành công!');
      },
      onError: (error) => onError(error),
    });
  };

  const handleRegister = useMutation({
    mutationKey: ['register'],
    mutationFn: (data) => {
      return axios.post("/auth/register", data);
    },
  });

  const onSubmitRegister = (
    data: { username: string; password: string },
    onError: (error: object) => void,
    onSuccess
  ) => {
    handleRegister.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const getTokenDuration = () => {
    const expirationDate = new Date(localStorage.getItem('expirationTime') || Date.now());
    const now = new Date()
    const duration = expirationDate.getTime() - now.getTime()
    return duration
  }

  return {
    userProfile,
    isAuthenticated,
    onSubmitAccountForm,
    handleLoginPassword,
    handleChangePassword,
    onSubmitChangePassword,
    logout: handleLogout,
    onSubmitRegister,
    handleRegister,
    getTokenDuration
  };
}
export default useAuth;
