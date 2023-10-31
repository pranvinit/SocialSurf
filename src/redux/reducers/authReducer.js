import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

import { auth, db, storage } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const THEMES = { default: "LIGHT", dark: "DARK" };

const INITIAL_STATE = {
  currentUser: JSON.parse(sessionStorage.getItem("currentUser")) || null,
  isLoading: false,
  error: null,
  preferences: { theme: THEMES.default },
};

export const authenticateUserAsync = createAsyncThunk(
  "auth/authenticateUser",
  async (uid, thunkAPI) => {
    if (!uid) thunkAPI.dispatch(setUser({}));
    const docRef = doc(db, "users", uid);
    const currentUser = await getDoc(docRef);
    thunkAPI.dispatch(setUser(currentUser.data()));
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser.data()));
  }
);

export const registerUserAsync = createAsyncThunk(
  "auth/registerUser",
  async ({ displayName, email, password, file }) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    let downloadUrl = null;
    if (file) {
      const storageRef = ref(storage, `${Date.now()}`);
      await uploadBytesResumable(storageRef, file);
      downloadUrl = await getDownloadURL(storageRef);
    }

    await updateProfile(auth.currentUser, {
      displayName,
      profilePicture: downloadUrl,
    });
    // create a new user in firestore
    const user = {
      uid: res.user.uid,
      displayName,
      profilePicture: downloadUrl,
      email,
      followers: [],
      following: [],
    };
    await setDoc(doc(db, "users", res.user.uid), user);
    return { user };
  }
);

export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }) => {
    return signInWithEmailAndPassword(auth, email, password);
  }
);

export const logoutUserAsync = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    await signOut(auth);
    thunkAPI.dispatch(logoutUser());
    sessionStorage.removeItem("currentUser");
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    fetchUser: (state, action) => {
      state.isLoading = true;
    },
    setUser: (state, { payload }) => {
      if (payload && payload.displayName) state.currentUser = payload;
      state.isLoading = false;
    },

    setTheme(state, action) {
      state.preferences.theme = action.payload;
    },
    logoutUser: (state, action) => {
      state.currentUser = null;
      toast.success("User logged out.");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        toast.success("User logged in.");
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      })
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUserAsync.fulfilled, (state, { payload }) => {
        state.currentUser = payload.user;
        state.isLoading = false;
        toast.success("User registered successfully.");
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      });
  },
});

export const authReducer = authSlice.reducer;
export const { fetchUser, setUser, setTheme, logoutUser } = authSlice.actions;

export const authSelector = (state) => state.authReducer;
