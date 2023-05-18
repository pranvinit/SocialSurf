import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "react-spinner-material";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, setUser } from "../../redux/reducers/authReducer";
import styles from "./sidebar.module.css";

export const Sidebar = () => {
  const dispatch = useDispatch();

  const { currentUser } = useSelector(authSelector);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    setLoading(true);
    const usersRef = collection(db, "users");
    const users = await getDocs(usersRef);
    const usersData = users.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      isFollowing: currentUser.following.includes(doc.data().uid),
    }));

    // can add more conditions here
    const filteredUserData = usersData.filter(
      (u) => u.uid !== currentUser.uid && u.isFollowing
    );

    setUsers(filteredUserData);
    setLoading(false);
  };

  const handleFollow = async (uid) => {
    const docRef = doc(db, "users", currentUser.uid);
    const updatedUser = {
      ...currentUser,
      following: [uid, ...currentUser.following],
    };
    await setDoc(docRef, updatedUser);
    dispatch(setUser(updatedUser));
  };

  const handleUnfollow = async (uid) => {
    const docRef = doc(db, "users", currentUser.uid);
    const updatedUser = {
      ...currentUser,
      following: currentUser.following.filter((u) => u !== uid),
    };
    await setDoc(docRef, updatedUser);
    dispatch(setUser(updatedUser));
  };

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <div className={styles.sidebar}>
      <h3>Following</h3>
      {loading && (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      )}
      {!loading && (
        <div className={styles.usersList}>
          {users.map((u) => (
            <div key={u.id} className={styles.user}>
              <div>{u.displayName[0]}</div>
              <div>{u.displayName}</div>
              <button
                onClick={() => {
                  !u.isFollowing ? handleFollow(u.uid) : handleUnfollow(u.uid);
                }}
                className={u.isFollowing ? styles.unfollow : ""}
              >
                {!u.isFollowing ? "Follow" : "Unfollow"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
