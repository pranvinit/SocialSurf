import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authSelector,
  registerUserAsync,
} from "../../redux/reducers/authReducer";
import styles from "./register.module.css";

const Register = () => {
  const [formInput, setFormInput] = useState({});
  const [file, setFile] = useState(null);

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
    if (!formInput.displayName || !formInput.email || !formInput.password)
      return;
    await dispatch(registerUserAsync({ ...formInput, file }));
    setFile(null);
    setFormInput({});
  };

  return (
    <div className={styles.register}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h3>Sign up to SocialSurf</h3>

        <input
          type="file"
          id="fileInput"
          className={styles.hiddenInput}
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <label htmlFor="fileInput" className={styles.fileInputLabel}>
          <img
            src={!file ? "/assets/camera.png" : URL.createObjectURL(file)}
            alt="camera"
          />
        </label>
        <div className={styles.field}>
          <label>Display Name</label>
          <input
            type="text"
            name="displayName"
            value={formInput.displayName || ""}
            onChange={handleChange}
            placeholder="Enter Name"
            required
          />
        </div>
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
          <button
            onClick={() => {
              setFile(null);
              setFormInput({});
            }}
            className={styles.cancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button type="submit" disabled={isLoading}>
            Register
          </button>
        </div>
        <div className={styles.login}>
          <span>Already have an account?</span>
          <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
