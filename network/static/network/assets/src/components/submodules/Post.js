import React, { useContext, useState, useEffect } from 'react';
import { profileCtx } from '../ProfileCtx';
import { userCtx } from '../UserCtx';
import { postCtx } from '../PostCtx';
import { Link } from 'react-router-dom';

const Post = ({ post_, getProfile, page, requiresPage, _loadPosts }) => {


  const [posts, setPosts, obj] = useContext(postCtx);
  const [following, setFollowing, fetchProfile] = useContext(profileCtx);
  const [user, setUser] = useContext(userCtx);

  const getClass = () => {
    if (post_.is_liked) {
      return 'btn btn-danger';
    } else {
      return 'btn btn-outline-danger';
    }
  }


  const requestLike = () => {
    fetch(`/request-like/${post_.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        is_liked: post_.is_liked
      })
    }).then(() => {
      if (requiresPage) {
        obj.fetchPosts(page)
      }
      console.log(_loadPosts);
      if (_loadPosts !== undefined) {
        _loadPosts();
      }
    })

  }

  const isFollowing = (userId, following_) => {
    for  (var i = 0; i < following.length; i++) {
      if ((following[i].following.username === following_) && (following[i].user.id === userId)) {
        return true;
      } 
    }
    return false;
  }


  const requestFollow = () => {
    if (isFollowing(user.id, post_.author)) {
      fetch('/getProfile/', {
        method: 'PUT',
        body: JSON.stringify({
          "unfollow": true,
          "following_username": post_.author 
        })
      }).then(() => fetchProfile())
    } else {
      fetch("/getProfile/", {
        method: 'PUT',
        body: JSON.stringify({
          "follow": true,
          "following_username": post_.author 
        })
      }).then(() => {
        fetchProfile();
        if (_loadPosts !== undefined) {
          _loadPosts();
        }
      })
    }
  }

  return (
    <div className="content-section mb-4">
      <p className="text-secondary">
        On: {post_['date-created']} By: {post_.author} 
        <br />
        { post_.author !== user.username &&
          <button className="btn btn-outline-info mt-3 mb-3" onClick={() => {requestFollow(); if (getProfile) {getProfile()} if (_loadPosts) {_loadPosts()}}}>
            {isFollowing(user.id, post_.author) === true? "Unfollow": "Follow"}
          </button>
        }
      </p>
      <h1 className="border-bottom mb-2">{post_.title}</h1>
      <br />
      <p className="border-bottom mb-3">{post_.body}</p>
      <button className={getClass()} onClick={() => {requestLike(); if (getProfile) {getProfile()}}}>
        <i className="fa fa-heart"></i> {post_.is_liked ? 'Unlike' : 'Like'} : {post_.likes_count}
      </button>
      <Link className="btn btn-blue ms-2" to={`/posts/${post_.id}`}>
        View
      </Link>
    </div>
  );
}

export default Post;