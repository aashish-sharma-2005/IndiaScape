import './App.css'
import { useEffect, useState } from "react";
import { TopNavBar } from "./screen/Navbar/index";
import { HomeHeroPage } from "./screen/HeroPage/index";
import { Routes, Route } from "react-router-dom";
import { Login } from "./screen/Auth/Login";
import { Signup } from "./screen/Auth/Signup";
import { VerifyOtp } from "./screen/Auth/VerifyOtp";
import { HomePage } from "./screen/Home";
import { States } from "./screen/State/index";
import Admin from "./screen/Admin/index";
import { useDispatch } from "react-redux";
import { loginSuccess, logout } from "./store/loginSlice";
import Loading from "./screen/Loading/";
import UserRoute from "./Guards/UserRoute";
import AdminRoute from "./Guards/AdminRoutes";
import AdminPlaces from "./component/Admin/AdminPlaces";
import AdminLayout from "./component/Admin/AdminLayout";
import { OneStateData } from "./component/State/OneStateData";
import AdminStates from "./component/Admin/AdminStates";
import { Details } from "./screen/Details";
import Footer from "./screen/Navbar/Footer";
import NotFound from './screen/NotFound';

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/me", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 401) {
          dispatch(logout());
          return;
        }

        const result = await response.json();

        if (result.status) {
          dispatch(loginSuccess(result.user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <div className="app-layout">

      {/* Fixed / Top Header */}
      <TopNavBar />

      {/* Middle Content */}
      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={<HomeHeroPage />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/verify-otp"
            element={<VerifyOtp />}
          />

          <Route
            path="/dashboard"
            element={
              <UserRoute>
                <HomePage />
              </UserRoute>
            }
          />

          <Route
            path="/dashboard/states"
            element={
              <UserRoute>
                <States />
              </UserRoute>
            }
          />

          <Route
            path="/dashboard/states/:state"
            element={
              <UserRoute>
                <OneStateData />
              </UserRoute>
            }
          />

          <Route
            path="/dashboard/place/:id"
            element={
              <UserRoute>
                <Details />
              </UserRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Admin />} />
            <Route path="places" element={<AdminPlaces />} />
            <Route path="states" element={<AdminStates />} />
          </Route>

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      {/* Bottom Footer */}
      <Footer />

    </div>
  );
}

export default App;