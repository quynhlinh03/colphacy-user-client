import { Center, Flex } from '@mantine/core';
import CartTable from '../components/Carts/CartTable';
import { SelectedProductCardItem } from '../types/Cart';
import { CartForm } from '../components/Carts/CartForm';
import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CartEmpty from './CartEmpty';
export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [cartList, setCartList] = useState<SelectedProductCardItem[]>();
  const setProducts = (data: SelectedProductCardItem[]) => {
    setCartList(data);
  };
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { state: { openLoginModal: true } });
    }
    // else {
    //   const tokenDuration = getTokenDuration()

    //   const logoutTimeout = setTimeout(() => {
    //     logout()
    //   }, tokenDuration)
    //   return () => {
    //     clearTimeout(logoutTimeout)
    //   }
    // }
  }, [isAuthenticated]);
  return (
    isAuthenticated && (
      <Center>
        <Flex w={'90%'} justify="center" m={'3rem'} h={'100%'}>
          <CartTable setProducts={setProducts} preCheckList={cartList} />
          {cartList && cartList?.length > 0 && (
            <>
              <CartForm allProductCart={cartList?.filter((item) => item.checked)} />
            </>
          )}
          {(cartList?.length == 0) && (
            <>
              <CartEmpty />
            </>
          )}
        </Flex>
      </Center>
    )
  );
}
