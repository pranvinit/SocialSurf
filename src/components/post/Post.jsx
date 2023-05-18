import { format } from "timeago.js";
import { useDispatch, useSelector } from "react-redux";
import { authSelector } from "../../redux/reducers/authReducer";
import {
  dislikePostAsync,
  likePostAsync,
  removeDislikePostAsync,
  removeLikePostAsync,
} from "../../redux/reducers/postsReducer";
import { useNavigate } from "react-router-dom";
import styles from "./post.module.css";

export const Post = ({ post, getDetails, commentsCountLocal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector(authSelector);
  const {
    text,
    image,
    created,
    displayName,
    uid,
    likes,
    dislikes,
    commentsCount,
  } = post;

  const isLiked = post.likes.includes(currentUser.uid);
  const isDisliked = post.dislikes.includes(currentUser.uid);

  const handleShare = (data) => {
    navigator.share(data);
  };

  const handleLike = () => {
    dispatch(likePostAsync({ post, currentUserId: currentUser.uid }));
    if (getDetails) getDetails();
  };

  const handleRemovelike = () => {
    dispatch(removeLikePostAsync({ post, currentUserId: currentUser.uid }));
  };
  const handleDislike = () => {
    dispatch(dislikePostAsync({ post, currentUserId: currentUser.uid }));
    if (getDetails) getDetails();
  };

  const handleRemoveDislike = () => {
    dispatch(removeDislikePostAsync({ post, currentUserId: currentUser.uid }));
    if (getDetails) getDetails();
  };

  return (
    <div className={styles.post}>
      <div className={styles.postWrapper}>
        <div className={styles.postTop}>
          <img
            src={
              !currentUser.profilePicture
                ? "/assets/person.png"
                : currentUser.profilePicture
            }
            alt="profile"
            className={styles.postProfileImg}
          />
          <span className={styles.postUsername}>{displayName}</span>
          <span className={styles.postDate}>{format(created.toDate())}</span>
        </div>
        <div className={styles.postCenter}>
          <span className={styles.postText}>{text}</span>
          {image && (
            <img src={post.image} alt="post" className={styles.postImg} />
          )}
        </div>
        <div className={styles.postBottom}>
          <div
            className={styles.postBottomItem}
            onClick={!isLiked ? handleLike : handleRemovelike}
          >
            <img
              src={!isLiked ? "/assets/like.png" : "/assets/like-filled.png"}
              alt="likes"
              className={styles.likeIcon}
            />
            <span>{likes.length} Likes</span>
          </div>
          <div
            className={styles.postBottomItem}
            onClick={!isDisliked ? handleDislike : handleRemoveDislike}
          >
            <img
              src={
                !isDisliked
                  ? "/assets/dislike.png"
                  : "/assets/dislike-filled.png"
              }
              alt="dislikes"
              className={styles.dislikeIcon}
            />
            <span>{dislikes.length} Dislikes</span>
          </div>
          <div
            className={styles.postBottomItem}
            onClick={() => navigate(`/users/${uid}/posts/${post.id}`)}
          >
            <img
              src={"/assets/comments.png"}
              alt="comments"
              className={styles.commentsIcon}
            />
            <span>{commentsCountLocal || commentsCount} Comments</span>
          </div>
          <div
            className={styles.postBottomItem}
            onClick={() =>
              handleShare({
                url:
                  window.location.href + "users/" + uid + "/posts/" + post.id,
                text: text,
                title: `SocialSurf - ${text}`,
              })
            }
          >
            <img
              src={"/assets/share.png"}
              alt="share"
              className={styles.shareIcon}
            />
            <span>Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};
