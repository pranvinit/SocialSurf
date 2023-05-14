import { NavLink, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  logoutUserAsync,
} from "../../redux/reducers/authReducer";
import styles from "./navbar.module.css";

export const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelector);

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
      <div className={styles.contentWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;
