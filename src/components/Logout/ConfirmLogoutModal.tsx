import { Button, Center, Flex, Modal, Text } from "@mantine/core";
import logout from "../../assets/images/logout.png";

interface ConfirmLogoutModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  onConfirm,
  onClose,
}) => {
  return (
    <Modal centered opened={true} onClose={onClose}>
      <Flex
        gap="lg"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <img width="150px" src={logout}></img>
        <div style={{ fontWeight: "bold" }}>Đăng xuất</div>
        <Text size="sm" px={20} align="center">
          Bạn sẽ không nhận được đặc quyền riêng dành cho thành viên.
        </Text>
        <Center>
          <Flex gap="md" pb={20}>
            <Button
              w={110}
              radius={50}
              variant="outline"
              onClick={onConfirm}
              styles={(theme) => ({
                root: {
                  color: theme.colors.munsellBlue[0],
                  ...theme.fn.hover({
                    color: theme.fn.darken(theme.colors.munsellBlue[0], 0.1),
                  }),
                },
              })}
            >
              Đăng xuất
            </Button>
            <Button
              w={110}
              radius={50}
              onClick={onClose}
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
            >
              Đóng
            </Button>
          </Flex>
        </Center>
      </Flex>
    </Modal>
  );
};

export default ConfirmLogoutModal;
