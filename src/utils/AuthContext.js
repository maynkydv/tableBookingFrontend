import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['tokenId']);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    userId: null,
    userName: null,
    role: null,
  });

  const checkAuth = () => {
    setCookie('working', 'authContext_dummy_token'); // just to check 
    if (cookies.tokenId) {
      try {
        const decodedToken = jwtDecode(cookies.tokenId);
        setAuthState({
          isLoggedIn: true,
          isAdmin: decodedToken.role === 'admin',
          userId: decodedToken.userId,
          userName: decodedToken.userName,
          role: decodedToken.role,
        });
      } catch (error) {
        console.error('Invalid token', error);
        setAuthState({
          isLoggedIn: false,
          isAdmin: false,
          userId: null,
          userName: null,
          role: null,
        });
      }
    } else {
      setAuthState({
        isLoggedIn: false,
        isAdmin: false,
        userId: null,
        userName: null,
        role: null,
      });
    }
  }


  const logout = () => {
    removeCookie('tokenId');
    setAuthState({
      isLoggedIn: false,
      isAdmin: false,
      userId: null,
      userName: null,
      role: null,
    });
  };

  if (authState === null) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ authState, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


