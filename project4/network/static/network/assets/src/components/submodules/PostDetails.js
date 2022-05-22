import React, { useState, useEffect, useContext } from 'react';
import { postCtx } from '../PostCtx';
import { profileCtx } from '../ProfileCtx';
import { userCtx } from '../UserCtx';
import EditForm from './EditForm';

const PostDetails = ({ match }) => {

  const [post, setPost] = useState({});
  const [posts, setPosts, obj] = useContext(postCtx);
  const [following, setFollowing, fetchProfile] = useContext(profileCtx);
  const [user, setUser] = useContext(userCtx);


  const isFollowing = (userId, following_) => {
    for (var i = 0; i < following.length; i++) {
      if (following[i].following.username === following_ && following[i].user.id === userId) {
        return true;
      }
      return false;
    }
  }

  const getPost = () => {

    fetch(`/get-post/${match.params.id}/`)
    .then(response => response.json())
    .then(data => setPost(data.post))

  }

  const getClass = () => {
    if (post.is_liked) {
      return 'btn btn-danger';
    } else {
      return 'btn btn-outline-danger';
    }
  }

  const requestLike = () => {
    fetch(`/request-like/${post.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        is_liked: post.is_liked
      })
    }).then(() => {
      setPost(prevState => {
        return {
          ...prevState,
          is_liked: !prevState.is_liked,
          likes_count: ( prevState.is_liked ? prevState.likes_count - 1 : prevState.likes_count + 1 )
        }
      })
      obj.fetchPosts(1);
    })

  }

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [editMode, setEditMode] = useState(false);


  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  }

  const handleEditMode = () => {
    setTitle(post.title);
    setBody(post.body);
    setEditMode(prevState => !prevState);
  }

  const updatePost = () => {
    fetch(`/editPost/${match.params.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        title: title,
        body: body
      })
    }).then(response => response.json())
    .then(data => {
      setPost(data.post);
      const newPosts = posts.filter(p => p.id !== data.post.id);
      setPosts([...newPosts, data.post]);
    })
  }

  const requestFollow = () => {
    if (isFollowing(user.id, post.author)) {
      fetch('/getProfile/', {
        method: 'PUT',
        body: JSON.stringify({
          "unfollow": true,
          "following_username": post.author 
        })
      }).then(() => fetchProfile())
    } else {
      fetch("/getProfile/", {
        method: 'PUT',
        body: JSON.stringify({
          "follow": true,
          "following_username": post.author 
        })
      }).then(() => fetchProfile())
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  return (
    <div className="content-section">
      <p className="text-secondary"> 
        On: {post['date-created']} By: {post.author} 
        <br />
        { post.author !== user.username &&
          <button className="btn btn-outline-info mt-3 mb-3" onClick={requestFollow}>
            {isFollowing(user.id, post.author) ? "Unfollow": "Follow"}
          </button>
        }
      </p>
      {
        editMode ? (
          <EditForm 
            handleBodyChange={handleBodyChange}
            handleTitleChange={handleTitleChange}
            title={title}
            body={body}
          />
        ) : 
        (
          <div>
            <h1 className="border-bottom mb-3 mt-2">{post.title}</h1>
            <p>{post.body}</p>
          </div>
        )
      }   
      <button className={`${getClass()} ms-2`} onClick={requestLike}>
        <i className="fa fa-heart"></i> {post.is_liked ? "Unlike" : "Like"} : {post.likes_count}
      </button>
      {
        post.author === user.username &&  
        <button 
          className="btn btn-outline-info ms-2" 
          onClick={() => {handleEditMode(); updatePost();}} 
          disabled={editMode ? !title || !body : editMode}
        >
          {editMode ? "Update" : "Edit"}
        </button>
      }
    </div>
  )
}

export default PostDetails;