import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, loginUserAsync } from "../../redux/reducers/authReducer";
import Spinner from "react-spinner-material";

import styles from "./login.module.css";

const Login = () => {
  const { currentUser } = useSelector(authSelector);

  const [formInput, setFormInput] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(authSelector);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formInput.email || !formInput.password) return;
    await dispatch(loginUserAsync(formInput));
    setFormInput({});
  };

  useEffect(() => {
    if (currentUser) navigate("/");
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className={styles.spinner}>
        <Spinner />
      </div>
    );
  }
  return (
    <div className={styles.login}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h3>Sign in to SocialSurf</h3>
        <div className={styles.field}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formInput.email || ""}
            onChange={handleChange}
            placeholder="Enter Email Address"
            required
          />
        </div>
        <div className={styles.field}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formInput.password || ""}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" disabled={isLoading}>
            Login
          </button>
          <button
            onClick={() => setFormInput({})}
            className={styles.cancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        <div className={styles.create}>
          <span>
            New to <b>SocialSurf</b>?
          </span>
          <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
