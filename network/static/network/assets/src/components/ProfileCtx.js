import React, { useState, createContext, useEffect } from 'react';

export const profileCtx = createContext();

export const ProfileContextProvider = (props) => {

  const [following, setFollowing] = useState([]);

  const fetchProfile = () => {
    fetch('/getProfile/')
    .then(response => response.json())
    .then(data => setFollowing(data.following))

    return following;
  }

  
  useEffect(() => {
    fetchProfile();
  }, [])

  return (
    <profileCtx.Provider value={[following, setFollowing, fetchProfile]}>
      {props.children}
    </profileCtx.Provider>
  )

}