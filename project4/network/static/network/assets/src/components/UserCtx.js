import React, { useEffect, createContext, useState } from 'react';

export const userCtx = createContext();

export const UserContextProvider = (props) => {

  const [user, setUser] = useState({});

  const getCurrentUser = () => {
    fetch('/get-current-user/')
    .then(response => response.json())
    .then(data => setUser(data.user))

    return user;
  }

  useEffect(() => {
    getCurrentUser();
  }, [])

  return (
    <userCtx.Provider value={[user, setUser]}>
      {props.children}
    </userCtx.Provider>
  )
}
