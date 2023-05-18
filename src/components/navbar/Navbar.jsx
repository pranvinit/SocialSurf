import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  logoutUserAsync,
  setUser,
} from "../../redux/reducers/authReducer";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "react-spinner-material";
import styles from "./navbar.module.css";

export const Navbar = () => {
  const dispatch = useDispatch();

  const [searchIntent, setSearchIntent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { currentUser } = useSelector(authSelector);

  const getSearchResult = async () => {
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
      (u) =>
        u.uid !== currentUser.uid &&
        u.displayName.toLowerCase().includes(searchInput.toLowerCase())
    );

    setSearchResult(filteredUserData);
    setLoading(false);
  };

  console.log(searchResult);

  useEffect(() => {
    if (currentUser) getSearchResult();
  }, [searchInput, currentUser]);

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

  return (
    <div>
      <div className={styles.navbar}>
        <img
          onClick={() => window.location.replace("/")}
          src="/assets/logo.png"
          alt="logo"
        />
        {currentUser && (
          <ul className={styles.left}>
            <li>
              <NavLink className={styles.item} activeclassname="active" to="/">
                Home
              </NavLink>
            </li>
          </ul>
        )}
        <ul className={styles.right}>
          <li>
            <img
              className={styles.searchIcon}
              src="/assets/search.png"
              alt="search"
              onClick={() => setSearchIntent(true)}
            />
          </li>
          {currentUser && (
            <li className={styles.profile}>
              <img
                src={
                  !currentUser.profilePicture
                    ? "/assets/person.png"
                    : currentUser.profilePicture
                }
                alt="profile"
              />
              <span>{currentUser.displayName}</span>
            </li>
          )}
          {currentUser && (
            <li
              className={styles.logout}
              onClick={() => dispatch(logoutUserAsync())}
            >
              Logout
            </li>
          )}
          {!currentUser && (
            <li>
              <NavLink
                className={styles.item}
                activeclassname="active"
                to="/login"
              >
                Login
              </NavLink>
            </li>
          )}
          {!currentUser && (
            <li>
              <NavLink
                className={styles.item}
                activeclassname="active"
                to="/register"
              >
                Register
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      {searchIntent && (
        <div className={styles.search}>
          <div className={styles.searchWrapper}>
            <img
              src="/assets/close.png"
              alt="close"
              onClick={() => {
                setSearchInput("");
                setSearchIntent(false);
              }}
            />
            <div className={styles.searchTop}>
              <input
                type="text"
                name="search"
                placeholder="Search SocialSurf"
                value={searchInput}
                onChange={({ target }) => setSearchInput(target.value)}
              />
            </div>
            <div className={styles.searchBottom}>
              {loading && (
                <div className={styles.spinner}>
                  <Spinner />
                </div>
              )}
              {searchResult.length === 0 && !searchInput && !loading && (
                <h3>Search for friends on SocialSurf</h3>
              )}
              {searchResult.length === 0 && searchInput && !loading && (
                <h3>No results found.</h3>
              )}
              {searchResult.length !== 0 && !loading && (
                <div className={styles.searchList}>
                  {!searchInput && <h3>SocialSurf Users</h3>}
                  {searchInput && <h3>Results</h3>}
                  {searchResult.map((u) => (
                    <div key={u.id} className={styles.user}>
                      {!u.profilePicture ? (
                        <div className={styles.avatar}>{u.displayName[0]}</div>
                      ) : (
                        <img src={u.profilePicture} alt="profile" />
                      )}
                      <div className={styles.displayName}>{u.displayName}</div>
                      <button
                        onClick={() => {
                          !u.isFollowing
                            ? handleFollow(u.uid)
                            : handleUnfollow(u.uid);
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
          </div>
        </div>
      )}
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
