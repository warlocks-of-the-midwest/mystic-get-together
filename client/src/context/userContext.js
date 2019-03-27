import React, { useState, useEffect } from 'react';
import { auth } from '../js-sdk/fire';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, authStateUpdate] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((u) => {
      if (u) {
        const { displayName, email, photoURL, uid } = u;
        authStateUpdate({ displayName, email, photoURL, uid });
      } else {
        authStateUpdate(null);
      }
    });
  }, []);

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
