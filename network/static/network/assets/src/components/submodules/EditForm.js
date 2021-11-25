import React from 'react';

const EditForm = ({ title, body, handleTitleChange, handleBodyChange }) => {

  return (
    <form>
      <input 
        value={title}
        className="form-control mb-3"
        onChange={handleTitleChange}
        placeholder='Title'
      />
      <input 
        value={body}
        className="form-control mb-3"
        onChange={handleBodyChange}
        placeholder='Body'
      />
    </form>
  );
}

export default EditForm;