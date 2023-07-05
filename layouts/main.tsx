import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';

import {
  SmileOutlined,
  LogoutOutlined

} from '@ant-design/icons'

import { Route, MenuDataItem } from '@ant-design/pro-layout/lib/typing'
import { PageContainer, ProConfigProvider } from '@ant-design/pro-components';
import Login from '../pages/login';
const ProLayout = dynamic(() => import('@ant-design/pro-layout'), {
  ssr: false,
})

const ROUTES: Route = {
  path: '/',
  routes: [
    {
      path: '/',
      name: 'Imagine your Image',
      icon: <SmileOutlined />,
    },
  ],
}

const menuHeaderRender = (
  logo: React.ReactNode,
  title: React.ReactNode
) => (
  <>
    <Link href="/">
      {logo}
      {title}
    </Link>   
  </>
);

const menuItemRender = (options: MenuDataItem, element: React.ReactNode) => (
  <Link href={options.path ?? '/'}>
    {element}
  </Link>
)

const isTokenExpired = () => {
  const expirationTimestamp = localStorage.getItem('expirationTimestamp');
  return expirationTimestamp && Date.now() > parseInt(expirationTimestamp);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationTimestamp');  
  router.push('/login');

};

export default function Main(children: JSX.Element) {
  const [loggedIn, setLoggedIn] = useState(true);
  const router = useRouter();  

  useEffect(() => {
    if (loggedIn) {
      const checkLoginStatus = () => {
        if (isTokenExpired()) {
          setLoggedIn(false);
          router.push('/login');
        } else {
          const authToken = localStorage.getItem('token');
          if (authToken) {
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
            router.push('/login');
          }
        }
      };

      checkLoginStatus();
    }
  }, [router]);

  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
    } else {
      setDark(false);
    }

    const handleThemeChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          setDark(true);
        } else {
          setDark(false);
        }
      };
      const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      themeQuery.addEventListener('change', handleThemeChange);

      return () => {
        themeQuery.removeEventListener('change', handleThemeChange);
      };
    }, []);
    
    if (!loggedIn) {
      console.log(loggedIn);
      return <Login />;
    }
 
  return (
    <ProConfigProvider
      dark={dark}
      hashed={false}>
      <ProLayout
        logo={"logo.png"}
        title="Emvue AI Draw"
        style={{ minHeight: '100vh' }}
        route={ROUTES}
        avatarProps={{
          src: 'emvue.png',
          title: 'Emvue',
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return [            
            <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <LogoutOutlined style={{ fontSize: 24 }} />
            </div>,
           
          ];
        }}
  
        menuItemRender={menuItemRender}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              Powered by Emvue
            </p>            
          );
        }}
        menuHeaderRender={menuHeaderRender}
      >
        {children}
        
      </ProLayout>
    </ProConfigProvider>
  )
}
