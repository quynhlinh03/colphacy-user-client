import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './layouts/Layout';
import ErrorPage from './pages/Error';
import Home from './pages/Home';
import { CART_MANAGEMENT, ORDER_MANAGEMENT } from './constants/routes';
import Cart from './pages/Cart';
import ChangePassword from './pages/ChangePassword';
import ProductDetail from './pages/ProductDetail';
import FilterProductList from './pages/FilterProductList';
import SearchPage from './pages/SearchPage';
import Order from './pages/Order';
import OrderHistory from './pages/OrderHistory';
import OrderHistoryDetail from './pages/OrderHistoryDetail';
import ReceiverManagement from './pages/ReceiverManagement';
import PersonalLayout from './layouts/Personal/PersonalLayout';
import { Profile } from './pages/Profile';
import * as ROUTES from './constants/routes';
import Branch from './pages/Branch';
import VerifyAccount from './pages/VerifyAccount';
import { loader as VerifyLoader } from './pages/VerifyAccount';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: CART_MANAGEMENT,
        element: <Cart />,
      },
      {
        path: ':id',
        element: <ProductDetail />,
      },
      {
        path: ORDER_MANAGEMENT,
        element: <Order />,
      },
      {
        path: 'category/:id',
        element: <FilterProductList />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'nearest_branch',
        element: <Branch />,
      },

      {
        path: ROUTES.PERSONAL,
        element: <PersonalLayout />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/profile" />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'change_password',
            element: <ChangePassword />,
          },
          {
            path: 'receiver_management',
            element: <ReceiverManagement />,
          },
          {
            path: 'my-order',
            element: <OrderHistory />,
          },
          {
            path: 'my-order/:id',
            element: <OrderHistoryDetail />,
          },
        ],
      },
    ],
  },
  {
    path: '/verify-email/:token',
    element: <VerifyAccount />,
  },
]);
