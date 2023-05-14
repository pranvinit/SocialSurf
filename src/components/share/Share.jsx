import { useState, useEffect, useRef } from "react";
import autosize from "autosize";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import Spinner from "react-spinner-material";
import {
  createPostAsync,
  postsSelector,
} from "../../redux/reducers/postsReducer";
import styles from "./share.module.css";

const Share = () => {
  const { currentUser } = useSelector(authSelector);
  const { isLoading } = useSelector(postsSelector);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const textbox = useRef(null);

  const dispatch = useDispatch();
  const resetInput = () => {
    setText("");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    await dispatch(
      createPostAsync({
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        text,
        file,
      })
    );
    resetInput();
  };

  useEffect(() => {
    autosize(textbox.current);
  }, []);

  return (
    <div className={styles.share}>
      <div className={styles.shareWrapper}>
        <form className={styles.shareTop}>
          <img src="/assets/person.png" alt="share" className={styles.avatar} />
          <textarea
            name="share"
            ref={textbox}
            value={text}
            onChange={({ target }) => setText(target.value)}
            placeholder={`What's on your mind ${currentUser.displayName}`}
            rows={1}
            required
          ></textarea>
        </form>
        <hr className={styles.shareHr} />
        {file && (
          <div className={styles.imgContainer}>
            <img
              className={styles.shareImg}
              src={URL.createObjectURL(file)}
              alt="share"
            />
            <img
              src="/assets/remove.png"
              alt="remove"
              className={styles.cancelImg}
              onClick={() => setFile(null)}
            />
          </div>
        )}
        <div className={styles.shareBottom}>
          <label htmlFor="fileInput">
            <img
              src="/assets/media.png"
              alt="media"
              className={styles.mediaIcon}
            />
            <input
              type="file"
              id="fileInput"
              className={styles.hiddenInput}
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <span className={styles.shareLabel}>Upload Media</span>
          </label>
          <button
            className={styles.shareButton}
            onClick={handleSubmit}
            disabled={!text && !file}
          >
            {!isLoading ? "Share" : <Spinner color="#fff" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Share;
