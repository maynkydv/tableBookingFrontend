import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {jwtDecode} from 'jwt-decode';

// Create AuthContext
const AuthContext = createContext();

// Provide the AuthContext to the entire app
export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['tokenId']);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
    userId: null,
    userName: null,
    role: null,
  });

  // Set the user information from the token stored in cookies
  useEffect(() => {
    if (cookies.tokenId) {
      try {
        const decodedToken = jwtDecode(cookies.tokenId);
        setAuthState({
          isLoggedIn: true,
          isAdmin: decodedToken.role === 'admin',
          userId: decodedToken.userId,    // Assuming the token contains `userId`
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
    }
  }, [cookies.tokenId]);

  // Handle logout
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

  // Context value to be used across the app
  return (
    <AuthContext.Provider value={{ authState, setAuthState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);
