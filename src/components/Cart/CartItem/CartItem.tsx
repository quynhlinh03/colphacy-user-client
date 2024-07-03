import { ActionIcon, Grid, Image } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { formatNumberWithCommas } from "../../../utils/common";

interface CartItemProps {
  name: string;
  price: number;
  images: string;
  unit: string;
  quantity: number;
  handleDeleteProductCart: () => void;
}

function CartItem({
  name,
  price,
  unit,
  images,
  quantity,
  handleDeleteProductCart,
}: CartItemProps) {
  return (
    <Grid className="container-product-cart-item">
      <Grid.Col span={3} className="image-product-item">
        <Image width={60} src={images} alt="Product Image" />
      </Grid.Col>
      <Grid.Col span={8}>
        <div className="name-product-item name-product-cart">{name}</div>
        <Grid justify="space-between" className="price-product-item">
          <span className="price">{formatNumberWithCommas(price)}đ</span>
          <span className="unit">
            x{quantity} {unit}
          </span>
        </Grid>
      </Grid.Col>
      <Grid.Col span={1} className="button-product-item">
        <ActionIcon
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
          <IconTrash size="1rem" onClick={handleDeleteProductCart} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
}

export default CartItem;
