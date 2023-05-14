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
  setDoc,
} from "firebase/firestore";

const INITIAL_STATE = { posts: [], isLoading: false, error: null };
export const getPostsAsync = createAsyncThunk(
  "posts/fetchPosts",
  async (currentUser) => {
    const postsRef = collection(db, "users", currentUser.uid, "posts");
    const userPosts = await getDocs(
      query(postsRef, orderBy("created", "desc"))
    );

    const userFeed = await Promise.all(
      currentUser.following.map((uid) => {
        const postsRef = collection(db, "users", uid, "posts");
        return getDocs(query(postsRef, orderBy("created", "desc")));
      })
    );

    let userFeedData = [];
    userFeed.forEach((d) => {
      d.docs.forEach((doc) => {
        const data = {
          id: doc.id,
          ...doc.data(),
        };
        userFeedData.push(data);
      });
    });

    const postsData = userPosts.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return [...userFeedData, ...postsData];
  }
);

export const createPostAsync = createAsyncThunk(
  "posts/createPost",
  async ({ uid, displayName, text, file }) => {
    let downloadUrl = null;
    if (file) {
      const storageRef = ref(storage, `${Date.now()}`);
      await uploadBytesResumable(storageRef, file);
      downloadUrl = await getDownloadURL(storageRef);
    }

    // create post here
    const post = {
      text,
      image: downloadUrl,
      created: Timestamp.now(),
      likes: [],
      dislikes: [],
      commentsCount: 0,
      uid,
      displayName,
    };
    const postsRef = collection(db, "users", uid, "posts");
    const docRef = await addDoc(postsRef, post);
    return { id: docRef.id, ...post };
  }
);

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async ({ post, currentUserId }, thunkAPI) => {
    try {
      const postRef = doc(db, "users", post.uid, "posts", post.id);
      const updatedPost = {
        ...post,
        likes: [currentUserId, ...post.likes],
        dislikes: post.dislikes.filter((d) => d !== currentUserId),
      };
      await setDoc(postRef, updatedPost);
      thunkAPI.dispatch(setUpdatedPosts(updatedPost));
    } catch (e) {
      console.log(e);
    }
  }
);

export const removeLikePostAsync = createAsyncThunk(
  "posts/removeLikePost",
  async ({ post, currentUserId }, thunkAPI) => {
    try {
      const postRef = doc(db, "users", post.uid, "posts", post.id);
      const updatedPost = {
        ...post,
        likes: post.likes.filter((l) => l !== currentUserId),
      };
      await setDoc(postRef, updatedPost);
      thunkAPI.dispatch(setUpdatedPosts(updatedPost));
    } catch (e) {
      console.log(e);
    }
  }
);

export const dislikePostAsync = createAsyncThunk(
  "posts/dislikePost",
  async ({ post, currentUserId }, thunkAPI) => {
    try {
      const postRef = doc(db, "users", post.uid, "posts", post.id);
      const updatedPost = {
        ...post,
        likes: post.likes.filter((l) => l !== currentUserId),
        dislikes: [currentUserId, ...post.dislikes],
      };
      await setDoc(postRef, updatedPost);
      thunkAPI.dispatch(setUpdatedPosts(updatedPost));
    } catch (e) {
      console.log(e);
    }
  }
);

export const removeDislikePostAsync = createAsyncThunk(
  "posts/removeDislikePost",
  async ({ post, currentUserId }, thunkAPI) => {
    try {
      const postRef = doc(db, "users", post.uid, "posts", post.id);
      const updatedPost = {
        ...post,
        dislikes: post.dislikes.filter((d) => d !== currentUserId),
      };
      await setDoc(postRef, updatedPost);
      thunkAPI.dispatch(setUpdatedPosts(updatedPost));
    } catch (e) {
      console.log(e);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: INITIAL_STATE,
  reducers: {
    setUpdatedPosts: (state, { payload }) => {
      const updatedPosts = state.posts.map((p) => {
        if (p.id === payload.id) {
          return payload;
        }
        return p;
      });
      state.posts = updatedPosts;
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
      .addCase(createPostAsync.fulfilled, (state, { payload }) => {
        state.posts.unshift(payload);
        state.isLoading = false;
        toast.success("Post added successfully.");
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
        state.posts = payload;
        state.isLoading = false;
      });
  },
});

export const postsReducer = postSlice.reducer;
export const { setUpdatedPosts } = postSlice.actions;

export const postsSelector = (state) => state.postsReducer;
