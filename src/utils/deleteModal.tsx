import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";

export const deleteModal = (
  title: string,
  name: string | undefined,
  onConfirm: () => void
) => {
  modals.openConfirmModal({
    title: (
      <>
        <div style={{ fontWeight: "bold" }}>{`Xóa ${title}`}</div> <br />
      </>
    ),
    centered: true,
    children: (
      <Text size="sm">
        Bạn có chắc chắn muốn xóa sản phẩm này không ?<b>{name}</b>
      </Text>
    ),
    labels: { confirm: "Xóa", cancel: "Hủy" },
    confirmProps: { color: "red" },
    onConfirm: onConfirm,
  });
};
