import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  logoutUserAsync,
} from "../../redux/reducers/authReducer";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Spinner from "react-spinner-material";
import styles from "./navbar.module.css";

export const Navbar = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { currentUser } = useSelector(authSelector);

  const getSearchResult = async () => {
    if (!searchInput) return setSearchResult([]);
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

  useEffect(() => {
    if (currentUser) getSearchResult();
  }, [searchInput]);

  console.log(searchResult);

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
            />
          </li>
          {currentUser && (
            <li className={styles.profile}>
              <img src="/assets/person.png" alt="profile" />
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
      <div className={styles.search}>
        <input
          type="text"
          name="search"
          placeholder="Search SocialSurf"
          value={searchInput}
          onChange={({ target }) => setSearchInput(target.value)}
        />
        <div className={styles.wrapper}>
          {loading && <Spinner />}
          {searchResult.length === 0 && !searchInput && !loading && (
            <h3>Search for friends on SocialSurf</h3>
          )}
          {searchResult.length === 0 && searchInput && !loading && (
            <h3>No results found.</h3>
          )}
          {searchResult.length !== 0 && !loading && (
            <div className={styles.searchList}>
              {searchResult.map((r) => (
                <div>
                  <h3>{r.displayName}</h3>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
