import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsAsync,
  postsSelector,
} from "../../redux/reducers/postsReducer";
import { authSelector } from "../../redux/reducers/authReducer";
import Spinner from "react-spinner-material";
import { Post } from "../post/Post";
import styles from "./feed.module.css";

export const Feed = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelector);
  const { posts, isLoading } = useSelector(postsSelector);

  useEffect(() => {
    dispatch(getPostsAsync(currentUser));
  }, [currentUser]);

  return (
    <div className={styles.feed}>
      <div className={styles.feedWrapper}>
        <h3>Feed</h3>
        {isLoading && (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        )}
        {!isLoading && posts.length === 0 && <h3>No posts found.</h3>}
        {!isLoading &&
          posts.length !== 0 &&
          posts.map((p) => <Post key={p.id} post={p} />)}
      </div>
    </div>
  );
};
