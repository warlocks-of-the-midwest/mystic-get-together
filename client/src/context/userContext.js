import React, { useState } from 'react';
import { auth } from '../js-sdk/fire';

export const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, authStateUpdate] = useState(null);
  auth.onAuthStateChanged((u) => {
    if (u) {
      authStateUpdate(u);
    } else {
      authStateUpdate(null);
    }
  });

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
