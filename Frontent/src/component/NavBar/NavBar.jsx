import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/loginSlice";
import "./NavBar.css";

const NavBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, isLogin } = useSelector(
    (state) => state.loginReducer
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const path = location.pathname.toLowerCase();

  // =========================
  // ADMIN -> NO HEADER
  // =========================

  if (user?.role === "admin" || path.startsWith("/admin")) {
    return null;
  }

  // =========================
  // HERO PAGE
  // =========================

  const isHeroPage = path === "/" || path === "/home";

  if (isHeroPage && !isLogin) {
    return (
      <header className="site-header">
        <Logo />

        <nav className="header-nav">
          <Link className="active" to="/">
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
          <Link to="/login" className="header-login">
            Login
          </Link>

          <Link to="/signup" className="header-signup">
            Sign Up
          </Link>
        </div>
      </header>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  if (path === "/login") {
    return (
      <header className="site-header auth-header">
        <Logo />

        <div className="auth-link">
          Don't have an account?
          <Link to="/signup">
            Sign Up
          </Link>
        </div>
      </header>
    );
  }

  // =========================
  // SIGNUP PAGE
  // =========================

  if (path === "/signup") {
    return (
      <header className="site-header auth-header">
        <Logo />

        <div className="auth-link">
          Already have an account?
          <Link to="/login">
            Login
          </Link>
        </div>
      </header>
    );
  }

  // =========================
  // LOGGED-IN USER HEADER
  // =========================

  if (isLogin) {
    return (
      <header className="site-header user-header">

        {/* LOGO */}
        <Logo />

        {/* CENTER NAVIGATION */}
        <nav className="header-nav user-nav">

          <Link
            className={path === "/home" ? "active" : ""}
            to="/home"
          >
            Home
          </Link>

          <Link
            className={path.startsWith("/states") ? "active" : ""}
            to="/states"
          >
            States
          </Link>

          <Link
            className={
              path.startsWith("/famous-places")
                ? "active"
                : ""
            }
            to="/famous-places"
          >
            Famous Places
          </Link>

          <Link
            className={
              path.startsWith("/favorites")
                ? "active"
                : ""
            }
            to="/favorites"
          >
            Favorite
          </Link>

        </nav>

        {/* USER */}
        <div className="user-menu">

          <button
            className="username-button"
            onClick={() =>
              setDropdownOpen(!dropdownOpen)
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
              className={`arrow ${
                dropdownOpen ? "rotate" : ""
              }`}
            >
              ▼
            </span>

          </button>

          {/* DROPDOWN */}
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
                onClick={() => {
                  dispatch(logout());
                  setDropdownOpen(false);
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

  // Agar kisi unknown page par logged out hai
  return (
    <header className="site-header">
      <Logo />

      <div className="header-actions">
        <Link to="/login" className="header-login">
          Login
        </Link>

        <Link to="/signup" className="header-signup">
          Sign Up
        </Link>
      </div>
    </header>
  );
};


// =========================
// LOGO
// =========================

const Logo = () => {
  return (
    <Link to="/" className="logo">

      <div className="logo-icon">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <span className="logo-text">
        IndiaScape
      </span>

    </Link>
  );
};


// =========================
// USERNAME HELPER
// =========================

const getUsername = (user) => {
  if (!user) return "User";

  return (
    user.username ||
    user.name ||
    user.email?.split("@")[0] ||
    "User"
  );
};

export default NavBar;