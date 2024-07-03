import { Button, Image } from '@mantine/core';
import { IconShoppingCart } from '@tabler/icons-react';
import { formatNumberWithCommas } from '../../utils/common';
import { Link, useNavigate } from 'react-router-dom';
import { handleGlobalException } from '../../utils/error';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

function ProductItem({
  name,
  price,
  unit,
  unitId,
  images,
  id,
}: ProductItemProps) {
  const { onSubmitAddPrductCart, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const onSubmit = (data: AddProductCartProps) => {
    onSubmitAddPrductCart(
      data,
      () => {
        fetchCart();
      },
      (error) => {
        if (!isAuthenticated)
          navigate('/', {
            state: { openLoginModal: true },
          });
        else handleGlobalException(error, () => {});
      },
    );
  };

  return (
    <Link className="link-no-underline" to={`/${id}`}>
      <div className="container-product-item">
        <div className="image-product-item">
          <Image px={20} mx="auto" src={images} alt="Product Image" />
        </div>
        <div className="name-product-item">{name}</div>
        <div className="price-product-item">
          <span className="price">{formatNumberWithCommas(price)}đ /</span>
          <span className="unit">{unit}</span>
        </div>
        <div className="button-product-item">
          <Button
            className="button"
            leftIcon={<IconShoppingCart size="1rem" />}
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
            onClick={(event) => {
              event.preventDefault();
              const newAddProductCart = {
                productId: id,
                quantity: 1,
                unitId: unitId,
              };
              onSubmit(newAddProductCart);
            }}
          >
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default ProductItem;
