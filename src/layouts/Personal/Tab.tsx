import { Image, Flex, Container, Text, NavLink } from "@mantine/core";
import {
  IconBoxSeam,
  IconLogout,
  IconMapPin,
  IconPassword,
  IconPill,
  IconUser,
} from "@tabler/icons-react";
import Avatar from "../../assets/images/user.png";
import { NavLink as RouterNavLink } from "react-router-dom";
import ConfirmLogoutModal from "../../components/Logout/ConfirmLogoutModal";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
function Link({ label, path }) {
  return (
    <RouterNavLink to={path} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <NavLink className="sub-tab" label={label} active={isActive} />
      )}
    </RouterNavLink>
  );
}

export default function Tab() {
  const { logout, userProfile } = useAuth();
  const [openConfirmLogout, setOpenConfirmLogout] = useState(false);

  const options = [
    {
      path: "profile",
      label: (
        <Container w="100%">
          <IconUser className="icon-tab" size={14} /> Thông tin cá nhân
        </Container>
      ),
    },
    {
      path: "change_password",
      label: (
        <Container w="100%">
          <IconPassword className="icon-tab" size={14} /> Đổi mật khẩu
        </Container>
      ),
    },
    {
      path: "my-order",
      label: (
        <Container w="100%">
          <IconBoxSeam className="icon-tab" size={14} /> Đơn hàng của tôi
        </Container>
      ),
    },
    {
      path: "receiver_management",
      label: (
        <Container>
          <IconMapPin className="icon-tab" size={14} /> Địa chỉ nhận hàng
        </Container>
      ),
    }
    ,
    // {
    //   path: "b",
    //   label: (
    //     <Container>
    //       <IconPill className="icon-tab" size={14} /> Đơn thuốc của tôi
    //     </Container>
    //   ),
    // },
  ];
  return (
    <Container>
      <Flex
        className="info-ctn"
        w="20rem"
        gap="xs"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        color="white"
      >
        <Image width={50} src={Avatar} />
        <Text>{userProfile?.fullName}</Text>
        <Text>{userProfile?.phone}</Text>
      </Flex>
      <div className="menu-ctn">
        {options.map((option) => {
          return <Link label={option.label} path={option.path} />;
        })}
        <Container
          className="sub-tab logout-tab"
          onClick={() => {
            setOpenConfirmLogout(true);
          }}
        >
          <IconLogout className="icon-tab" size={14} /> Đăng xuất
        </Container>
      </div>
      {openConfirmLogout && (
        <ConfirmLogoutModal
          onConfirm={() => {
            logout.mutate();
            setOpenConfirmLogout(false);
          }}
          onClose={() => {
            setOpenConfirmLogout(false);
          }}
        />
      )}
    </Container>
  );
}
