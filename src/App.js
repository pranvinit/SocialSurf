import "./App.css";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase";

//action creators, selector functions imports
import {
  authSelector,
  authenticateUserAsync,
  fetchUser,
} from "./redux/reducers/authReducer";

// pages imports
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import PostDetails from "./pages/postDetails/PostDetails";
import NotFound from "./pages/notfound/NotFound";

// components imports
import { Navbar } from "./components/navbar/Navbar";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

// react toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(authSelector);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) return <Navigate to="/login" replace={true} />;
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          ),
        },
        {
          path: "/users/:uid/posts/:postId",
          element: (
            <ProtectedRoute>
              <PostDetails />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  // firebase auth observer
  useEffect(() => {
    if (!currentUser) dispatch(fetchUser());

    const unsub = onAuthStateChanged(auth, (user) => {
      dispatch(authenticateUserAsync(user?.uid));
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
