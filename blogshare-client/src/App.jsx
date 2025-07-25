import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";
import GifComponent from "./components/LoadingGif";

function App() {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <GifComponent />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />

        <Route
          path="/pubprofile/:authorId/:blogId"
          element={<PublicProfile />}
        />


        <Route element={<PrivateRoute user={user} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;