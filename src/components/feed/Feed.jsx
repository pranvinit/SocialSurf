import { useEffect } from "react";
import styles from "./feed.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsAsync,
  postsSelector,
} from "../../redux/reducers/postsReducer";
import { authSelector } from "../../redux/reducers/authReducer";
import { Post } from "../post/Post";

export const Feed = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelector);
  const { posts } = useSelector(postsSelector);

  useEffect(() => {
    dispatch(getPostsAsync(currentUser.uid));
  }, [currentUser]);

  console.log(posts);

  return (
    <div className={styles.feed}>
      <h3>Feed</h3>
      <Post />
      <Post />
      <Post />
    </div>
  );
};
