import { AppShell } from '@mantine/core';
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Header from './Header';
import useAuth from '../hooks/useAuth';
import { useEffect, } from 'react';

const Layout: React.FC = () => {
  const { isAuthenticated, getTokenDuration, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!isAuthenticated) {
      if (
        location.pathname.startsWith('/category') ||
        location.pathname.startsWith('/search')
      ) {
        const path = `${location.pathname}${location.search}`;
        navigate(path);
      } else
        navigate('/', {
          state: { openLoginModal: true, from: location.pathname },
        });
    } else {
      const { state } = location;
      if (state && state.from) navigate(state.from);
      else navigate(location.pathname);
      
      const tokenDuration = getTokenDuration()
      const logoutTimeout = setTimeout(() => {
        logout.mutate();
      
      }, tokenDuration)
      return () => {
        clearTimeout(logoutTimeout)
      }
    }

   
  }, []);
  return (
    <AppShell padding={0} navbarOffsetBreakpoint="sm" header={<Header />}>
      <div className="layout-content">
        <Outlet></Outlet>
      </div>
    </AppShell>
  );
};
export default Layout;
