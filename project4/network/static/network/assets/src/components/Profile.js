import React, { useContext, useEffect, useState } from 'react';
import { profileCtx } from './ProfileCtx';
import Post from './submodules/Post';
import { userCtx } from './UserCtx';

const Profile = () => {

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useContext(userCtx);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [_, __, fetchProfile] = useContext(profileCtx);

  const getProfile = () => {
    fetch('/getProfile/')
    .then(response => response.json())
    .then(data => {
      setPosts(data.posts_);
      setFollowers(data.followers);
      setFollowing(data.following);
    })
  }
  useEffect(() => {
    getProfile();
  }, [])



  const unfollow = (username) => {
    fetch('/getProfile/', {
      method: 'PUT',
      body: JSON.stringify({
        "unfollow": true,
        "following_username": username
      })
    }).then(() => {
      fetch('/getProfile/')
      .then(response => response.json())
      .then(data => {
        setFollowing(data.following);
        fetchProfile();
      })
    });
  }

  return (
    <div className="content-section container grid">
      
      <h1 className="border-bottom mb-4">{user.username}</h1>

      <div className="row" style={{  }}>
        <ul className="list-group col" align="left">
          <h1 className="list-group-item">
            Following
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={ {fontSize:"15px"} }>
                {following.length}
            </span>
          </h1>
          <ul className="list-group">
            {
              following.map(f => (
                <li className="list-group-item list-group-item-action">
                  {f.following.username}
                  <button className="btn btn-blue" style={ {width: "100px", marginLeft: "25px"} } onClick={() => unfollow(f.following.username)}>Unfollow</button>
                </li>
              ))
            }
          </ul>
        </ul>
        <ul className="list-group col" align="left">
          <h1 className="list-group-item">
            Followers
            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={ {fontSize:"15px"} }>
                {followers.length}
            </span>
          </h1>
            <ul className="list-group">
              {
                followers.map(f => (
                  <li className="list-group-item list-group-item-action">{f.user.username}</li>
                ))
              } 
            </ul>
        </ul>
        <div class="col" style={ {marginLeft:"-10px"} }>
          {
            posts.map(post => (
              <Post 
                post_={post}
                getProfile={getProfile}
                requiresPage={false}
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Profile;
