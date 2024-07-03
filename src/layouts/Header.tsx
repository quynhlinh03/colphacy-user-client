import { Header, Button, Modal, Menu, Image, Text, Flex, Box } from "@mantine/core";
import {
  IconPhoneFilled,
  IconUser,
  IconLogout,
  IconMapPin,
  IconBoxSeam,
  IconPassword,
} from "@tabler/icons-react";
import Logo from "../assets/images/logo.png";
import Search from "../components/Search/Search";
import MenuBar from "../components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import LoginForm from "../components/LoginForm/index";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useListCategory } from "../hooks/useCategory";
import CartMenu from "../components/Cart/CartMenu/CartMenu";
import ConfirmLogoutModal from "../components/Logout/ConfirmLogoutModal";
import useCart from "../hooks/useCart";
import React from "react";
import Email from "../assets/images/tick.png"

const HomeHeader = React.memo(() => {
  const { fetchCart } = useCart();

  const [opened, { open, close }] = useDisclosure(false);
  const [verifyOpened, { open: verifyOpen, close: verifyClose }] = useDisclosure(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { ListCategoryData } = useListCategory();

  const { isAuthenticated, userProfile, logout } = useAuth();

  const [openConfirmLogout, setOpenConfirmLogout] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [queryParameters] = useSearchParams();

  const onSearch = (searchValue: string) => {
    queryParameters.set("keyword", searchValue);
    navigate(`search/?${decodeURIComponent(queryParameters.toString())}`);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isLoad]);

  useEffect(() => {
    if (location?.state?.openLoginModal) {
      open();
    }
  }, [location?.state]);

  return (
    <>
      <Header className="header-ctn" height={{ base: 215, md: 215 }} p="0">
        <div className="header-above-ctn">
          <div className="header-above">
            <div className="download-ctn">
              <a className="download" href="">
                Tải ngay ứng dụng
              </a>
              <span> của chúng tôi để có những trải nghiệm tốt nhất!</span>
            </div>
            <div className="advise">
              <IconPhoneFilled
                className="iconPhoneFilled"
                size="1rem"
              ></IconPhoneFilled>
              <span>Tư vấn ngay: 18006928 </span>
            </div>
          </div>
        </div>
        <div className="header-below-ctn">
          <div className="header-below">
            <a href="/">
              <img width="165px" src={Logo}></img>
            </a>
            <Search
              onSearch={onSearch}
              keyword={queryParameters.get("keyword")}
            />
            <div>
              {!isAuthenticated ? (
                <>
                  <Button
                    onClick={open}
                    leftIcon={<IconUser size="15px" />}
                    variant="white"
                    styles={(theme) => ({
                      root: {
                        color: theme.colors.munsellBlue[0],
                      },
                    })}
                  >
                    Đăng nhập
                  </Button>
                  <Modal
                    opened={opened}
                    onClose={close}
                    centered
                    transitionProps={{
                      transition: "pop-bottom-left",
                      duration: 300,
                    }}
                  >
                    <LoginForm closeModal={() => {
                      close()
                      verifyOpen()
                    }} />

                    {/* {!loginWithOTP && (
                      <LoginForm onMethodChange={handleLoginMethodToggle} />
                    )}
                    {loginWithOTP &&
                      (enterOTP ? (
                        <OTPForm onMethodLogin={handleLoginOTP} />
                      ) : (
                        <LoginOTPForm
                          onMethodChange={handleLoginMethodToggle}
                          onMethodLogin={handleLoginOTP}
                        />
                      ))} */}
                  </Modal>
                  <Modal opened={verifyOpened} onClose={verifyClose} centered>
                    {/* Modal content */}
                    <Flex align="center" justify="center" direction="column"> <Box w={100} h={100}><Image src={Email} fit="contain" /></Box>
                      <Text style={{ textAlign: "center", fontStyle: 'italic' }} pt="sm">Tài khoản của bạn đã đăng ký thành công. Vui lòng kiểm tra email của bạn và xác nhận yêu cầu để hoàn tất quá trình đăng ký.</Text>
                    </Flex>


                  </Modal>
                </>
              ) : (
                <>
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <Button
                        onClick={close}
                        leftIcon={<IconUser size="15px" />}
                        variant="white"
                        styles={(theme) => ({
                          root: {
                            color: theme.colors.munsellBlue[0],
                          },
                        })}
                      >
                        {userProfile?.fullName}
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown className="menu-dropdown">
                      <Menu.Item
                        className="menu-item"
                        icon={<IconUser size={14} />}
                        onClick={() => {
                          navigate("/personal/profile");
                        }}
                      >
                        Thông tin cá nhân
                      </Menu.Item>
                      <Menu.Item
                        className="menu-item"
                        icon={<IconPassword size={14} />}
                        onClick={() => {
                          navigate("/personal/change_password");
                        }}
                      >
                        Đổi mật khẩu
                      </Menu.Item>
                      <Menu.Item
                        className="menu-item"
                        icon={<IconBoxSeam size={14} />}
                          onClick={() => {
                            navigate("/personal/my-order");
                          }}
                      >
                        Đơn hàng của tôi
                      </Menu.Item>
                      <Menu.Item
                        className="menu-item"
                        icon={<IconMapPin size={14} />}
                        onClick={() => {
                          navigate("/personal/receiver_management");
                        }}
                      >
                        Địa chỉ nhận hàng
                      </Menu.Item>
                      <Menu.Item
                        className="menu-item"
                        icon={<IconLogout size={14} />}
                        onClick={() => {
                          setOpenConfirmLogout(true);
                        }}
                      >
                        Đăng xuất
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </>
              )}
              {openConfirmLogout && (
                <ConfirmLogoutModal
                  onConfirm={() => {
                    logout.mutate();
                    setOpenConfirmLogout(false);
                    setIsLoad((prev) => !prev);
                  }}
                  onClose={() => {
                    setOpenConfirmLogout(false);
                  }}
                />
              )}
              <>
                <CartMenu />
              </>
            </div>
          </div>
        </div>
        {ListCategoryData?.data && <MenuBar links={ListCategoryData.data} />}
      </Header>
    </>
  );
});

export default HomeHeader;
