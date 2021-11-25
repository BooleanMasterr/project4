import Nav from './components/Nav';
import { PostContextProvider } from './components/PostCtx';
import { UserContextProvider } from './components/UserCtx';
import { ProfileContextProvider } from './components/ProfileCtx';
import CreatePost from './components/CreatePost';
import Posts from './components/Posts';
import PostDetails from './components/submodules/PostDetails';
import React from 'react';
import Profile from './components/Profile';
import Following from './components/Following';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';

const App = () => {

  return (
    <Router>
        <PostContextProvider>
          <UserContextProvider>
            <ProfileContextProvider>
              <Nav />
              <Switch>
                <Route exact path="/" component={Posts} />
                <Route path="/new-post" component={CreatePost} />
                <Route path="/posts/:id" component={PostDetails} />
                <Route path="/profile" component={Profile} />
                <Route path="/following" component={Following} />
              </Switch>
            </ProfileContextProvider>
          </UserContextProvider>
        </PostContextProvider>
    </Router>
  )
}

export default App;