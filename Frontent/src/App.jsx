import "./App.css";

import { TopNavBar } from "./screen/Navbar/index";
import { HomeHeroPage } from "./screen/HeroPage/index";
import {
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import { Login } from "./screen/Auth/Login";
import { Signup } from "./screen/Auth/Signup";
import { VerifyOtp } from "./screen/Auth/VerifyOtp";

import { HomePage } from "./screen/Home";
import { States } from "./screen/State/index";

import Admin from "./screen/Admin/index";
import AdminPlaces from "./component/Admin/AdminPlaces";
import AdminLayout from "./component/Admin/AdminLayout";
import AdminStates from "./component/Admin/AdminStates";

import { OneState } from "./screen/State/OneState";
import { Details } from "./screen/Details";

import Footer from "./screen/Navbar/Footer";
import NotFound from "./screen/NotFound/index";
import Loading from "./screen/Loading/";

import UserRoute from "./Guards/UserRoute";
import AdminRoute from "./Guards/AdminRoutes";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { fetchStatesData } from "./store/statesSlice";
import { fetchUser } from "./store/loginSlice";


function App() {

    const dispatch = useDispatch();
    const location = useLocation();

    const [loading, setLoading] = useState(true);

    const isAdmin = location.pathname.startsWith("/admin");

    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/verify-otp";


    // =========================================
    // INITIALIZE APPLICATION
    // =========================================

    useEffect(() => {

        const initializeApp = async () => {

            try {

                // Get currently logged-in user
                // and update Redux state
                await dispatch(fetchUser()).unwrap();

            } catch (error) {

                // User is not logged in
                console.log("User not authenticated");

            } finally {

                // Authentication check completed
                setLoading(false);

            }

        };


        initializeApp();

        // Fetch states data
        dispatch(fetchStatesData());

    }, [dispatch]);


    // =========================================
    // WAIT FOR AUTH CHECK
    // =========================================

    if (loading) {
        return <Loading />;
    }


    // =========================================
    // APP
    // =========================================

    return (
        <>

            {/* HEADER */}
            {!isAdmin && <TopNavBar />}


            {/* PAGE CONTENT */}
            <main
                className={`app-main ${
                    isAuthPage ? "auth-main" : ""
                }`}
            >

                <Routes>

                    {/* =========================
                        PUBLIC HOME
                    ========================= */}

                    <Route
                        path="/"
                        element={<HomeHeroPage />}
                    />


                    {/* =========================
                        AUTH
                    ========================= */}

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


                    {/* =========================
                        USER
                    ========================= */}

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
                                <OneState />
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


                    {/* =========================
                        ADMIN
                    ========================= */}

                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }
                    >

                        <Route
                            index
                            element={<Admin />}
                        />

                        <Route
                            path="places"
                            element={<AdminPlaces />}
                        />

                        <Route
                            path="states"
                            element={<AdminStates />}
                        />

                    </Route>


                    {/* =========================
                        404
                    ========================= */}

                    <Route
                        path="*"
                        element={<NotFound />}
                    />

                </Routes>

            </main>


            {/* FOOTER */}
            {!isAdmin && <Footer />}

        </>
    );
}


export default App;