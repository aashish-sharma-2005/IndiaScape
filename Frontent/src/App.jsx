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

// =========================================
// FAVORITES
// =========================================

import FavoritePage from "./screen/Favorite";

import Footer from "./screen/Navbar/Footer";
import NotFound from "./screen/NotFound/index";
import Loading from "./screen/Loading/";

import UserRoute from "./Guards/UserRoute";
import AdminRoute from "./Guards/AdminRoutes";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    useEffect,
    useState,
} from "react";

import AdminUsers from "./component/Admin/AdminUsers";

import {
    fetchStatesData,
    addStateRealtime,
    updateState,
    deleteStateRealtime,
    updateStateVisibility,
} from "./store/statesSlice";

import {
    addPlaceRealtime,
    updatePlaceRealtime,
    deletePlaceRealtime,
} from "./store/placesSlice";

import {
    fetchUser,
    logout,
} from "./store/loginSlice";


// =====================================================
// APP
// =====================================================

function App() {

    const dispatch = useDispatch();

    const location =
        useLocation();

    const navigate =
        useNavigate();


    const [loading, setLoading] =
        useState(true);


    // =========================================
    // CURRENT USER
    // =========================================

    const user = useSelector(
        (state) =>
            state.loginReducer.user
    );


    // =========================================
    // PAGE CONDITIONS
    // =========================================

    const isAdmin =
        location.pathname.startsWith(
            "/admin"
        );


    const isAuthPage =
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname ===
        "/verify-otp";


    // =========================================
    // INITIALIZE APPLICATION
    // =========================================

    useEffect(() => {

        let isActive = true;

        const initializeApp = async () => {

            try {

                await dispatch(
                    fetchUser()
                ).unwrap();

            } catch (error) {

                console.log(
                    "User not authenticated"
                );

            } finally {

                // =========================================
                // IMPORTANT
                //
                // Only the latest active effect can
                // finish the initial loading state.
                //
                // Prevents redirect race condition
                // during React development StrictMode.
                // =========================================

                if (isActive) {

                    setLoading(false);

                }

            }

        };


        initializeApp();


        // =========================================
        // FETCH STATES
        // =========================================

        dispatch(
            fetchStatesData()
        );


        // =========================================
        // CLEANUP
        // =========================================

        return () => {

            isActive = false;

        };

    }, [dispatch]);


    // =====================================================
    // REAL-TIME EVENTS
    // =====================================================

    useEffect(() => {


        // =================================================
        // USER BLOCKED
        // =================================================

        const handleUserBlocked =
            async (blockedUser) => {

                console.log(
                    "Socket → userBlocked:",
                    blockedUser
                );


                // =========================================
                // Make sure there is a logged-in user
                // =========================================

                if (!user?._id) {
                    return;
                }


                // =========================================
                // Check if THIS browser belongs
                // to the blocked user
                // =========================================

                if (
                    user._id.toString() !==
                    blockedUser.userId.toString()
                ) {

                    return;
                }


                console.log(
                    "Current user has been blocked."
                );


                // =========================================
                // CLEAR BACKEND COOKIE
                // =========================================

                try {

                    await fetch(
                        "http://localhost:3000/logout",
                        {
                            method: "POST",
                            credentials:
                                "include",
                        }
                    );

                } catch (error) {

                    console.log(
                        "Logout request error:",
                        error
                    );
                }


                // =========================================
                // CLEAR REDUX LOGIN STATE
                // =========================================

                dispatch(
                    logout()
                );


                // =========================================
                // REDIRECT TO LOGIN
                // =========================================

                navigate(
                    "/login",
                    {
                        replace: true,
                    }
                );

            };


        // =================================================
        // USER UNBLOCKED
        // =================================================

        const handleUserUnblocked =
            (updatedUser) => {

                console.log(
                    "Socket → userUnblocked:",
                    updatedUser
                );

            };


        // =================================================
        // STATE ADDED
        // =================================================

        const handleStateAdded =
            (newState) => {

                console.log(
                    "Socket → stateAdded:",
                    newState
                );

                dispatch(
                    addStateRealtime(
                        newState
                    )
                );

            };


        // =================================================
        // STATE UPDATED
        // =================================================

        const handleStateUpdated =
            (updatedState) => {

                console.log(
                    "Socket → stateUpdated:",
                    updatedState
                );

                dispatch(
                    updateState(
                        updatedState
                    )
                );

            };


        // =================================================
        // STATE DELETED
        // =================================================

        const handleStateDeleted =
            (deletedState) => {

                console.log(
                    "Socket → stateDeleted:",
                    deletedState
                );

                dispatch(
                    deleteStateRealtime(
                        deletedState
                    )
                );

            };


        // =================================================
        // STATE VISIBILITY
        // =================================================

        const handleStateVisibilityUpdated =
            (updatedState) => {

                console.log(
                    "Socket → stateVisibilityUpdated:",
                    updatedState
                );


                dispatch(
                    updateStateVisibility(
                        updatedState
                    )
                );


                // =========================================
                // If current state became hidden
                // =========================================

                if (
                    updatedState.visible ===
                    false
                ) {

                    const currentPath =
                        decodeURIComponent(
                            location.pathname
                        );


                    const statePath =
                        `/dashboard/states/${updatedState.name}`;


                    if (
                        currentPath ===
                        statePath
                    ) {

                        console.log(
                            "Current state hidden → redirect"
                        );


                        navigate(
                            "/dashboard/states"
                        );

                    }

                }

            };


        // =================================================
        // PLACE ADDED
        // =================================================

        const handlePlaceAdded =
            (newPlace) => {

                console.log(
                    "Socket → placeAdded:",
                    newPlace
                );


                dispatch(
                    addPlaceRealtime(
                        newPlace
                    )
                );

            };


        // =================================================
        // PLACE UPDATED
        // =================================================

        const handlePlaceUpdated =
            (data) => {

                console.log(
                    "Socket → placeUpdated:",
                    data
                );


                dispatch(
                    updatePlaceRealtime(
                        data.place
                    )
                );

            };


        // =================================================
        // PLACE DELETED
        // =================================================

        const handlePlaceDeleted =
            (deletedPlace) => {

                console.log(
                    "Socket → placeDeleted:",
                    deletedPlace
                );


                dispatch(
                    deletePlaceRealtime(
                        deletedPlace._id
                    )
                );

            };


        // =================================================
        // DRAFT ADDED
        // =================================================

        const handleDraftAdded =
            (newDraft) => {

                console.log(
                    "Socket → draftAdded:",
                    newDraft
                );

            };


        // =================================================
        // REGISTER SOCKET LISTENERS
        // =================================================

        socket.on(
            "userBlocked",
            handleUserBlocked
        );


        socket.on(
            "userUnblocked",
            handleUserUnblocked
        );


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
            "placeAdded",
            handlePlaceAdded
        );


        socket.on(
            "placeUpdated",
            handlePlaceUpdated
        );


        socket.on(
            "placeDeleted",
            handlePlaceDeleted
        );


        socket.on(
            "draftAdded",
            handleDraftAdded
        );


        // =================================================
        // CLEANUP
        // =================================================

        return () => {

            socket.off(
                "userBlocked",
                handleUserBlocked
            );


            socket.off(
                "userUnblocked",
                handleUserUnblocked
            );


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
                "placeAdded",
                handlePlaceAdded
            );


            socket.off(
                "placeUpdated",
                handlePlaceUpdated
            );


            socket.off(
                "placeDeleted",
                handlePlaceDeleted
            );


            socket.off(
                "draftAdded",
                handleDraftAdded
            );

        };

    }, [
        dispatch,
        location.pathname,
        navigate,
        user,
    ]);


    // =====================================================
    // WAIT FOR AUTH CHECK
    // =====================================================

    if (loading) {

        return <Loading />;

    }


    // =====================================================
    // APP
    // =====================================================

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
                        FAVORITES
                    ================================= */}

                    <Route
                        path="/dashboard/favorites"
                        element={
                            <UserRoute>
                                <FavoritePage />
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


                        <Route
                            path="users"
                            element={
                                <AdminUsers />
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