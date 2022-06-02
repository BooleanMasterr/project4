import React, { useState, createContext, useEffect, useContext } from 'react';


export const postCtx = createContext();

export const PostContextProvider = (props) => {


  const [posts, setPosts] = useState([]);
  const [hasNext, setNext] = useState(false);
  const [hasPrev, setPrev] = useState(false);

  const fetchPosts = (p) => {
    fetch(`/posts/pages/${p}/`)
    .then(response => response.json())
    .then(data => {
      setPosts(data.posts);
      setNext(data.hasNext);
      setPrev(data.hasPrev);
    });

  }

  useEffect(() => {
    fetchPosts(1);
  }, [])

  return (
    <postCtx.Provider value={[posts, setPosts, {fetchPosts, hasNext, hasPrev}]}>
      {props.children}
    </postCtx.Provider>
  )

}