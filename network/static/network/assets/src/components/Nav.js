import { Link } from 'react-router-dom';
import React from 'react';

const Nav = () => {

  const allPosts = () => {
    setTimeout(() => window.location.reload(), 0.4);
  }

  return (
    <header class="p-3 text-white dark" id="navBar">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        
        <ul class="nav__links nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><Link to="/new-post" className="nav-link text-white">Add Post</Link></li>
            <li><Link to="/" className="nav-link text-white" onClick={allPosts}>All Posts</Link></li>
            <li><Link to="/profile" className="nav-link text-white">Profile</Link></li>
            <li><Link to="/following" className="nav-link text-white">Following</Link></li>
            <a href="/logout/"><button class="nav-btn">Logout</button></a>
        </ul>
      </div>
    </div>
  </header>
  );
}

export default Nav;