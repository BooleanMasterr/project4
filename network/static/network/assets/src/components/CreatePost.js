import React, { useState, useContext } from 'react';
import { postCtx } from './PostCtx';

const CreatePost = () => {

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [posts, setPosts] = useContext(postCtx);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  }

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/create-post/', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        body: body
      })
    }).then(response => response.json())
    .then(data => {
      if (data.error) {
        setError(data.error);
        setMessage('');
      } else {
        setMessage(data.message);
        setError('');
      }
    })
    window.location.reload();
  }

  return (
    <form className="content-section">
      {
        error &&  (
          <div role="alert" className="alert alert-danger">
            {error}
          </div>
        )
      }
      {
        message && (
          <div role="alert" className="alert alert-success">  
            {message}
          </div>
        )
      }
      <h1 className="border-bottom mb-4">Create A Post</h1>
      <input 
        className="form-control"
        onChange={handleTitleChange}
        placeholder='Title'
        value={title}
      />
      <br />
      <textarea 
        className="form-control"
        onChange={handleBodyChange}
        placeholder='Body'
        value={body}
      />
      <br />
      <button className="btn btn-outline-primary" disabled={!title || !body} onClick={handleSubmit}>Create</button>
    </form>
  )

}

export default CreatePost;