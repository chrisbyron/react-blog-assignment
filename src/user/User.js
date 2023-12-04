import React, { useEffect, useState } from "react";
import {Link, Route, Switch, useParams, useRouteMatch} from "react-router-dom";
import UserProfile from "./UserProfile";
import { fetchUserWithPosts } from "../api";
import PostList from "./PostList";
import PostsNav from "./PostsNav";
import ErrorMessage from "../common/ErrorMessage";

export const User = () => {
  const [user, setUser] = useState({ posts: [] });
  const [error, setError] = useState(undefined);
  const userId = useParams()["userId"];

  useEffect(() => {
    const abortController = new AbortController();
    fetchUserWithPosts(userId, abortController.signal)
      .then(setUser)
      .catch(setError);

    return () => abortController.abort();
  }, [userId]);
  const {url} = useRouteMatch();

  if (error) {
    return (
      <ErrorMessage error={error}>
        <p>
          <Link to="/">Return Home</Link>
        </p>
      </ErrorMessage>
    );
  }

  return (
    <section className="container">
      <PostsNav />
      <div className="border p-4 h-100 d-flex flex-column">
        <h2 className="mb-3">{user.name}</h2>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to={`${url}`} className="nav-link">Profile</Link>
          </li>
          <li className="nav-item">
          <Link to={`${url}/posts`} className="nav-link">Posts</Link>
          </li>
        </ul>

        {user.id ? (
          <div className="p-4 border border-top-0">
            <Switch>
            <Route path={`${url}/posts`}>
              {/* <Route path="/users/:userId/posts"> */}
                <PostList posts={user.posts} />
              </Route>
              {/* <Route exact path="/users/:userId"> */}
              <Route exact path={`${url}`}>
                <UserProfile user={user}></UserProfile>
              </Route>
            </Switch>
          </div>
        ) : (
          <div className="p-4 border border-top-0">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default User;
