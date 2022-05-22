import React, { useState, useEffect } from 'react';
import Post from './submodules/Post';

const Following = () => {

  const [following, setFollowing] = useState([]);

  const loadPosts = () => {
    fetch('/getProfile/')
    .then(response => response.json())
    .then(data => {
      setFollowing(data.posts);
    });
  }

  useEffect(() => {
    loadPosts();
  }, []);


  return (
    <div>
      {
        following.map(p => (
          <Post 
            post_={p}
            requiresPage={false}
            _loadPosts={loadPosts}
          />
        ))
      }
    </div>
  );

}

export default Following;