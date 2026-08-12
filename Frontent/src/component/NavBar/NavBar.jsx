import React, { useState } from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    useDispatch,
    useSelector
} from "react-redux";

import {
    logoutUser
} from "../../store/loginSlice";

import {
    Compass,
    Map,
    Landmark,
    Heart,
    Search,
    UserCircle,
    Menu,
    X,
    ChevronDown
} from "lucide-react";

import "./NavBar.css";


const NavBar = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        isLogin,
        user
    } = useSelector(
        (state) => state.loginReducer
    );


    const [dropdownOpen, setDropdownOpen] =
        useState(false);

    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const [searchText, setSearchText] =
        useState("");


    const path =
        location.pathname.toLowerCase();


    // =========================================
    // SEARCH
    // =========================================

    const handleSearch = (event) => {

        event.preventDefault();

        const query =
            searchText.trim();

        if (!query) {
            return;
        }

        navigate(
            `/dashboard/search?q=${encodeURIComponent(query)}`
        );

        setMobileMenuOpen(false);
    };


    // =========================================
    // CLOSE MOBILE MENU
    // =========================================

    const closeMobileMenu = () => {

        setMobileMenuOpen(false);

    };


    // =========================================
    // ADMIN
    // =========================================

    if (
        user?.role === "admin" ||
        path.startsWith("/admin")
    ) {

        return null;

    }


    // =========================================
    // PUBLIC HOME
    // =========================================

    const isHeroPage =
        path === "/" ||
        path === "/home";


    if (isHeroPage && !isLogin) {

        return (

            <header className="site-header public-header">

                <Link
                    className="logo"
                    to="/"
                >
                    <span className="logo-text">
                        IndiaScape
                    </span>
                </Link>


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
                    <span className="logo-text">
                        IndiaScape
                    </span>
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
                    <span className="logo-text">
                        IndiaScape
                    </span>
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
    // LOGGED IN USER
    // =========================================

    if (isLogin) {

        return (

            <header className="site-header user-header">


                {/* =================================
                    TOP ROW
                ================================= */}

                <div className="navbar-main">


                    {/* LOGO */}

                    <Link
                        className="logo"
                        to="/dashboard"
                        onClick={closeMobileMenu}
                    >

                        <span className="logo-text">
                            IndiaScape
                        </span>

                    </Link>


                    {/* =================================
                        DESKTOP NAVIGATION
                    ================================= */}

                    <nav className="header-nav user-nav">


                        {/* EXPLORE */}

                        <Link
                            className={
                                path === "/dashboard" ||
                                path === "/home"
                                    ? "active"
                                    : ""
                            }
                            to="/dashboard"
                        >

                            <Compass className="nav-icon" />

                            <span>
                                Explore
                            </span>

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

                            <Map className="nav-icon" />

                            <span>
                                States Map
                            </span>

                        </Link>


                        {/* FAMOUS */}

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

                            <Landmark className="nav-icon" />

                            <span>
                                Famous
                            </span>

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

                            <Heart className="nav-icon" />

                            <span>
                                Favorites
                            </span>

                        </Link>

                    </nav>


                    {/* =================================
                        SEARCH
                    ================================= */}

                    <form
                        className="navbar-search"
                        onSubmit={handleSearch}
                    >

                        <Search
                            className="navbar-search-icon"
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(event) =>
                                setSearchText(
                                    event.target.value
                                )
                            }
                        />

                    </form>


                    {/* =================================
                        USER
                    ================================= */}

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

                            <UserCircle
                                className="user-icon"
                            />

                            <span className="username-text">
                                {getUsername(user)}
                            </span>

                            <ChevronDown
                                className={
                                    `arrow ${
                                        dropdownOpen
                                            ? "rotate"
                                            : ""
                                    }`
                                }
                            />

                        </button>


                        {dropdownOpen && (

                            <div className="user-dropdown">

                                <Link
                                    to="/profile"
                                    onClick={() =>
                                        setDropdownOpen(
                                            false
                                        )
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


                    {/* =================================
                        MOBILE MENU BUTTON
                    ================================= */}

                    <button
                        type="button"
                        className="mobile-menu-button"
                        onClick={() =>
                            setMobileMenuOpen(
                                (prev) => !prev
                            )
                        }
                    >

                        {mobileMenuOpen ? (
                            <X />
                        ) : (
                            <Menu />
                        )}

                    </button>

                </div>


                {/* =================================
                    MOBILE SEARCH
                ================================= */}

                <form
                    className="mobile-search"
                    onSubmit={handleSearch}
                >

                    <Search />

                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(event) =>
                            setSearchText(
                                event.target.value
                            )
                        }
                    />

                </form>


                {/* =================================
                    MOBILE NAVIGATION
                ================================= */}

                {mobileMenuOpen && (

                    <nav className="mobile-nav">


                        <Link
                            className={
                                path === "/dashboard"
                                    ? "active"
                                    : ""
                            }
                            to="/dashboard"
                            onClick={closeMobileMenu}
                        >

                            <Compass />

                            <span>
                                Explore
                            </span>

                        </Link>


                        <Link
                            className={
                                path.startsWith(
                                    "/dashboard/states"
                                )
                                    ? "active"
                                    : ""
                            }
                            to="/dashboard/states"
                            onClick={closeMobileMenu}
                        >

                            <Map />

                            <span>
                                States Map
                            </span>

                        </Link>


                        <Link
                            to="/dashboard"
                            onClick={closeMobileMenu}
                        >

                            <Landmark />

                            <span>
                                Famous
                            </span>

                        </Link>


                        <Link
                            to="/dashboard/favorites"
                            onClick={closeMobileMenu}
                        >

                            <Heart />

                            <span>
                                Favorites
                            </span>

                        </Link>

                    </nav>

                )}

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

                <span className="logo-text">
                    IndiaScape
                </span>

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