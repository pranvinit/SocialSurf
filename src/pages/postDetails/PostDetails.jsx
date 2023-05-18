import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Comment } from "../../components/comment/Comment";
import { Post } from "../../components/post/Post";
import { format } from "timeago.js";
import Spinner from "react-spinner-material";
import styles from "./postDetails.module.css";

const PostDetails = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { uid, postId } = useParams();

  const getPostDetails = async () => {
    const docRef = doc(db, "users", uid, "posts", postId);
    const post = await getDoc(docRef);
    setPost(post.data());
  };

  const getPostComments = async () => {
    const commentsRef = collection(
      db,
      "users",
      uid,
      "posts",
      postId,
      "comments"
    );
    const comments = await getDocs(
      query(commentsRef, orderBy("created", "desc"))
    );
    const commentsData = comments.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setComments(commentsData);
  };

  console.log(comments);

  useEffect(() => {
    getPostDetails();
    getPostComments();
  }, []);

  return (
    <div className={styles.postDetails}>
      <div className={styles.postDetailsTop}>
        <img onClick={() => navigate("/")} src="/assets/back.png" alt="back" />
        <h3>Post</h3>
      </div>
      <div className={styles.postDetailsCenter}>
        {!post && (
          <div className={styles.spinner}>
            <Spinner />
          </div>
        )}
        {post && (
          <Post
            post={post}
            getDetails={getPostDetails}
            commentsCountLocal={comments.length}
          />
        )}
      </div>
      <div className={styles.postDetailsBottom}>
        {post && (
          <Comment
            userId={uid}
            postId={postId}
            setComments={setComments}
            commentsCount={comments.length}
          />
        )}
        <hr className={styles.commentHr} />
        {comments.map((c) => (
          <div key={c.id}>
            <div className={styles.commentTop}>
              <div>{c.displayName[0]}</div>
              <b>{c.displayName}</b>
              <span>{format(c.created.toDate())}</span>
            </div>
            <div className={styles.commentBottom}>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostDetails;
