import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import autosize from "autosize";
import Spinner from "react-spinner-material";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import styles from "./comment.module.css";
import { db } from "../../firebase";

export const Comment = ({ userId, postId, setComments, commentsCount }) => {
  const { currentUser } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const textbox = useRef(null);

  const resetInput = () => {
    setText("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    setLoading(true);

    const postRef = doc(db, "users", userId, "posts", postId);
    const commentsRef = collection(
      db,
      "users",
      userId,
      "posts",
      postId,
      "comments"
    );
    const comment = {
      displayName: currentUser.displayName,
      profilePicture: currentUser.profilePicture,
      text,
      created: Timestamp.now(),
    };
    const docRef = await addDoc(commentsRef, comment);
    await setDoc(
      postRef,
      { commentsCount: commentsCount + 1 },
      { merge: true }
    );
    setComments((prev) => [{ id: docRef.id, ...comment }, ...prev]);
    setText("");
    setLoading(false);
    toast.success("Comment added successfully.");
  };

  useEffect(() => {
    autosize(textbox.current);
  }, []);

  return (
    <div className={styles.comment}>
      <form onSubmit={handleSubmit}>
        <div className={styles.commentTop}>
          <textarea
            name="comment"
            ref={textbox}
            value={text}
            onChange={({ target }) => setText(target.value)}
            placeholder={`Add a comment ${currentUser.displayName}`}
            rows={1}
            required
          ></textarea>
        </div>
        <div className={styles.commentBottom}>
          <button
            className={styles.commentButton}
            onClick={resetInput}
            disabled={!text}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.commentButton}
            disabled={!text}
          >
            {!loading ? "Publish" : <Spinner color="#fff" />}
          </button>
        </div>
      </form>
    </div>
  );
};
