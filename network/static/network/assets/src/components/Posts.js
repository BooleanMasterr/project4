import React, { useContext, useEffect, useState } from 'react';
import { postCtx } from './PostCtx';
import Post from './submodules/Post';

const Posts = () => {

  const [posts, setPosts, obj] = useContext(postCtx);
  
  const getPageNumber = () => {
    return  parseInt(localStorage.getItem('page'))
  }

  const updatePageNumber = (n) => {
    localStorage.setItem('page', getPageNumber() + n)
  }

  const getNext = () => {
    obj.fetchPosts(getPageNumber() + 1)
    updatePageNumber(1)
  }

  const getPrev = () => {
    obj.fetchPosts(getPageNumber() - 1)
    updatePageNumber(-1)
  }

  

  return (
    <div>
      {
        posts.map(post => (
          <Post 
            post_={post}
            page={getPageNumber()}
            requiresPage={true}
          />
        ))
      }
      <footer>
        <div className="content-section">
          { obj.hasPrev &&
            <button className="btn btn-outline-secondary me-2" onClick={getPrev}>
              Previous 
            </button>
          }
          <p style={ {display: "inline-block"} }>
            {getPageNumber()}
          </p>
          {
            obj.hasNext &&
            <button className="btn btn-outline-secondary ms-2" onClick={getNext}>
              Next 
            </button>
          }
        </div>
      </footer>
    </div>
  )
}

export default Posts;