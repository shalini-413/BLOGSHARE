import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./services/api";
import GifComponent from "./components/LoadingGif";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoadingUser(false); 
      }
    };

    fetchUser();
  }, []);

  if (loadingUser) {
    return <GifComponent />;
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/pubprofile/:authorId/:blogId"
          element={<PublicProfile />}
        />

        <Route
          element={<PrivateRoute user={user} />}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
