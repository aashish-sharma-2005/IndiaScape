import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../store/loginSlice";

import "./NavBar.css";


const NavBar = () => {

    const location = useLocation();
    const dispatch = useDispatch();

    const {
        isLogin,
        user
    } = useSelector(
        (state) => state.loginReducer
    );

    const [dropdownOpen, setDropdownOpen] =
        useState(false);

    const path =
        location.pathname.toLowerCase();


    // =========================================
    // ADMIN PAGES -> NO HEADER
    // =========================================

    if (
        user?.role === "admin" ||
        path.startsWith("/admin")
    ) {
        return null;
    }


    // =========================================
    // PUBLIC HOME / HERO
    // =========================================

    const isHeroPage =
        path === "/" ||
        path === "/home";


    if (isHeroPage && !isLogin) {

        return (

            <header className="site-header">

                {/* =========================
                    LOGO
                ========================= */}

                <Link
                    className="logo"
                    to="/"
                >

                    <Logo />

                </Link>


                {/* =========================
                    NAVIGATION
                ========================= */}

                <nav className="header-nav">

                    <Link
                        className="active"
                        to="/"
                    >
                        Home
                    </Link>

                    <Link to="/states">
                        States
                    </Link>

                    <Link to="/famous-places">
                        Famous Places
                    </Link>

                    <Link to="/about">
                        About
                    </Link>

                    <Link to="/contact">
                        Contact
                    </Link>

                </nav>


                {/* =========================
                    ACTIONS
                ========================= */}

                <div className="header-actions">

                    <Link
                        to="/login"
                        className="header-login"
                    >
                        Login
                    </Link>

                    <Link
                        to="/signup"
                        className="header-signup"
                    >
                        Sign Up
                    </Link>

                </div>

            </header>

        );

    }


    // =========================================
    // LOGIN
    // =========================================

    if (path === "/login") {

        return (

            <header className="site-header auth-header">

                <Link
                    className="logo"
                    to="/"
                >

                    <Logo />

                </Link>


                <div className="auth-link">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/signup">
                        Sign Up
                    </Link>

                </div>

            </header>

        );

    }


    // =========================================
    // SIGNUP
    // =========================================

    if (path === "/signup") {

        return (

            <header className="site-header auth-header">

                <Link
                    className="logo"
                    to="/"
                >

                    <Logo />

                </Link>


                <div className="auth-link">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </header>

        );

    }


    // =========================================
    // LOGGED-IN USER
    // =========================================

    if (isLogin) {

        return (

            <header className="site-header user-header">

                {/* =========================
                    LOGO
                ========================= */}

                <Link
                    className="logo"
                    to="/dashboard"
                >

                    <Logo />

                </Link>


                {/* =========================
                    USER NAVIGATION
                ========================= */}

                <nav className="header-nav user-nav">

                    {/* HOME */}

                    <Link
                        className={
                            path === "/home" ||
                            path === "/dashboard"
                                ? "active"
                                : ""
                        }
                        to="/dashboard"
                    >
                        Home
                    </Link>


                    {/* STATES */}

                    <Link
                        className={
                            path.startsWith(
                                "/dashboard/states"
                            )
                                ? "active"
                                : ""
                        }
                        to="/dashboard/states"
                    >
                        States
                    </Link>


                    {/* FAMOUS PLACES */}

                    <Link
                        className={
                            path.startsWith(
                                "/dashboard/place"
                            )
                                ? "active"
                                : ""
                        }
                        to="/dashboard"
                    >
                        Famous Places
                    </Link>


                    {/* FAVORITES */}

                    <Link
                        className={
                            path.startsWith(
                                "/dashboard/favorites"
                            )
                                ? "active"
                                : ""
                        }
                        to="/dashboard/favorites"
                    >
                        Favorite
                    </Link>

                </nav>


                {/* =========================
                    USER MENU
                ========================= */}

                <div className="user-menu">

                    <button
                        type="button"
                        className="username-button"
                        onClick={() =>
                            setDropdownOpen(
                                (prev) => !prev
                            )
                        }
                    >

                        <span className="user-avatar">

                            {getUsername(user)
                                .charAt(0)
                                .toUpperCase()}

                        </span>


                        <span>
                            {getUsername(user)}
                        </span>


                        <span
                            className={
                                `arrow ${
                                    dropdownOpen
                                        ? "rotate"
                                        : ""
                                }`
                            }
                        >
                            ▼
                        </span>

                    </button>


                    {/* =========================
                        DROPDOWN
                    ========================= */}

                    {dropdownOpen && (

                        <div className="user-dropdown">

                            <Link
                                to="/profile"
                                onClick={() =>
                                    setDropdownOpen(false)
                                }
                            >
                                Profile
                            </Link>


                            <button
                                type="button"
                                onClick={async () => {

                                    try {

                                        await dispatch(
                                            logoutUser()
                                        ).unwrap();

                                        setDropdownOpen(
                                            false
                                        );

                                    } catch (error) {

                                        console.log(
                                            "Logout failed:",
                                            error
                                        );

                                    }

                                }}
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </header>

        );

    }


    // =========================================
    // UNKNOWN PUBLIC PAGE
    // =========================================

    return (

        <header className="site-header">

            <Link
                className="logo"
                to="/"
            >

                <Logo />

            </Link>


            <div className="header-actions">

                <Link
                    to="/login"
                    className="header-login"
                >
                    Login
                </Link>

                <Link
                    to="/signup"
                    className="header-signup"
                >
                    Sign Up
                </Link>

            </div>

        </header>

    );

};


// =========================================
// LOGO
// =========================================

const Logo = () => {

    return (

        <>
            <span className="logo-icon">

                <span></span>
                <span></span>
                <span></span>
                <span></span>

            </span>

            <span className="logo-text">
                IndiaScape
            </span>
        </>

    );

};


// =========================================
// USERNAME
// =========================================

const getUsername = (user) => {

    if (!user) {
        return "User";
    }

    return (
        user.username ||
        user.name ||
        user.email?.split("@")[0] ||
        "User"
    );

};


export default NavBar;