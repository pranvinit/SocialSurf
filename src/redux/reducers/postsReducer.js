import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

const INITIAL_STATE = { posts: [], isLoading: false, error: null };

export const createPostAsync = createAsyncThunk(
  "posts/createPost",
  async ({ uid, text, file }) => {
    const storageRef = ref(storage, `${Date.now()}`);
    await uploadBytesResumable(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    // create post here
    const post = {
      text,
      image: downloadUrl,
      created: Timestamp.now(),
      likes: [],
      dislikes: [],
    };
    return addDoc(doc(db, "users", uid, "posts"), post);
  }
);

export const getPostsAsync = createAsyncThunk(
  "posts/fetchPosts",
  async (uid, thunkAPI) => {
    const postsRef = collection(db, "users", uid, "posts");
    const userPosts = await getDocs(
      query(postsRef, orderBy("created", "desc"))
    );
    return userPosts;
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  reducers: {
    setPosts: (state, { payload }) => {
      state.posts = payload.userPosts;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPostAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getPostsAsync.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getPostsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        toast.error(action.error.message);
      })
      .addCase(getPostsAsync.fulfilled, (state, { payload }) => {
        state.posts = payload.userPosts;
        state.isLoading = false;
      });
  },
});

export const postsReducer = postSlice.reducer;
export const { setPosts } = postSlice.actions;

export const postsSelector = (state) => state.postsReducer;
