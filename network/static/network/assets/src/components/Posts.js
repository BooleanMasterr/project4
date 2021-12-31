import React, { useContext, useEffect, useState } from 'react';
import { postCtx } from './PostCtx';
import Post from './submodules/Post';

const Posts = () => {

  const [posts, setPosts, obj] = useContext(postCtx);
  const [page, setPage] = useState(1);

  const getNext = () => {
    obj.fetchPosts(page+1);
    window.scrollTo(0, 0);
    setPage(prevState => prevState + 1);
  }


  const getPrev = () => {
    obj.fetchPosts(page-1);
    window.scrollTo(0, 0);
    setPage(prevState => prevState - 1);
  }

  return (
    <div>
      {
        posts.map(post => (
          <Post 
            post_={post}
            page={page}
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
            {page}
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