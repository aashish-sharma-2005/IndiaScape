import "./App.css";
import socket from "./socket/socket";

import { TopNavBar } from "./screen/Navbar/index";
import { HomeHeroPage } from "./screen/HeroPage/index";

import {
    Routes,
    Route,
    useLocation,
    useNavigate,
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

import {
    fetchStatesData,
    addStateRealtime,
    updateState,
    deleteStateRealtime,
    updateStateVisibility,
    updateStateImage,
} from "./store/statesSlice";

import { fetchUser } from "./store/loginSlice";


function App() {

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);


    // =========================================
    // PAGE CONDITIONS
    // =========================================

    const isAdmin =
        location.pathname.startsWith("/admin");

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

                // Check currently logged-in user
                await dispatch(
                    fetchUser()
                ).unwrap();

            } catch (error) {

                // User is not logged in
                console.log(
                    "User not authenticated"
                );

            } finally {

                // VERY IMPORTANT
                // Stop loading after auth check
                setLoading(false);

            }

        };


        initializeApp();


        // Fetch states from backend
        dispatch(
            fetchStatesData()
        );


    }, [dispatch]);


    // =========================================
    // REAL-TIME STATE EVENTS
    // =========================================

    useEffect(() => {


        // -----------------------------------------
        // STATE ADDED
        // -----------------------------------------

        const handleStateAdded = (newState) => {

            console.log(
                "State added from server:",
                newState
            );

            dispatch(
                addStateRealtime(newState)
            );

        };


        // -----------------------------------------
        // STATE UPDATED
        // -----------------------------------------

        const handleStateUpdated = (updatedState) => {

            console.log(
                "State updated from server:",
                updatedState
            );

            dispatch(
                updateState(updatedState)
            );

        };


        // -----------------------------------------
        // STATE DELETED
        // -----------------------------------------

        const handleStateDeleted = (deletedState) => {

            console.log(
                "State deleted from server:",
                deletedState
            );

            dispatch(
                deleteStateRealtime(
                    deletedState
                )
            );

        };


        // -----------------------------------------
        // STATE VISIBILITY UPDATED
        // -----------------------------------------

        const handleStateVisibilityUpdated = async (updatedState) => {

            console.log(
                "State visibility updated from server:",
                updatedState
            );


            // =========================================
            // STATE HIDDEN
            // =========================================

            if (updatedState.visible === false) {

                dispatch(
                    updateStateVisibility(updatedState)
                );


                const currentPath =
                    decodeURIComponent(location.pathname);

                const statePath =
                    `/dashboard/states/${updatedState.name}`;


                if (currentPath === statePath) {

                    console.log(
                        "Current state hidden. Redirecting..."
                    );

                    navigate("/dashboard/states");

                }

                return;
            }


            // =========================================
            // STATE SHOWN
            // =========================================
            // Fetch again because backend response
            // contains complete state + photos data.
            // =========================================

            if (updatedState.visible === true) {

                console.log(
                    "State shown. Refreshing states data..."
                );

                await dispatch(
                    fetchStatesData()
                );

            }

        };


        // -----------------------------------------
        // PLACE UPDATED
        // -----------------------------------------

        const handlePlaceUpdated =
            (updatedPlace) => {

                console.log(
                    "Place updated from server:",
                    updatedPlace
                );

                dispatch(
                    updateStateImage(
                        updatedPlace
                    )
                );

            };


        // =========================================
        // SOCKET LISTENERS
        // =========================================

        socket.on(
            "stateAdded",
            handleStateAdded
        );

        socket.on(
            "stateUpdated",
            handleStateUpdated
        );

        socket.on(
            "stateDeleted",
            handleStateDeleted
        );

        socket.on(
            "stateVisibilityUpdated",
            handleStateVisibilityUpdated
        );

        socket.on(
            "placeUpdated",
            handlePlaceUpdated
        );


        // =========================================
        // CLEANUP
        // =========================================

        return () => {

            socket.off(
                "stateAdded",
                handleStateAdded
            );

            socket.off(
                "stateUpdated",
                handleStateUpdated
            );

            socket.off(
                "stateDeleted",
                handleStateDeleted
            );

            socket.off(
                "stateVisibilityUpdated",
                handleStateVisibilityUpdated
            );

            socket.off(
                "placeUpdated",
                handlePlaceUpdated
            );

        };


    }, [
        dispatch,
        location.pathname,
        navigate
    ]);


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

            {/* =================================
                HEADER
            ================================= */}

            {!isAdmin && (
                <TopNavBar />
            )}


            {/* =================================
                PAGE CONTENT
            ================================= */}

            <main
                className={`app-main ${isAuthPage
                        ? "auth-main"
                        : ""
                    }`}
            >

                <Routes>


                    {/* =================================
                        PUBLIC HOME
                    ================================= */}

                    <Route
                        path="/"
                        element={
                            <HomeHeroPage />
                        }
                    />


                    {/* =================================
                        AUTH
                    ================================= */}

                    <Route
                        path="/login"
                        element={
                            <Login />
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <Signup />
                        }
                    />

                    <Route
                        path="/verify-otp"
                        element={
                            <VerifyOtp />
                        }
                    />


                    {/* =================================
                        USER
                    ================================= */}

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


                    {/* =================================
                        ADMIN
                    ================================= */}

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
                            element={
                                <Admin />
                            }
                        />

                        <Route
                            path="places"
                            element={
                                <AdminPlaces />
                            }
                        />

                        <Route
                            path="states"
                            element={
                                <AdminStates />
                            }
                        />

                    </Route>


                    {/* =================================
                        404
                    ================================= */}

                    <Route
                        path="*"
                        element={
                            <NotFound />
                        }
                    />

                </Routes>

            </main>


            {/* =================================
                FOOTER
            ================================= */}

            {!isAdmin && (
                <Footer />
            )}

        </>
    );

}


export default App;