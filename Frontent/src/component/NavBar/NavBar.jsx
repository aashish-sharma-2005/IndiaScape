import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, logoutUser } from "../../store/loginSlice";
import "./NavBar.css";

const NavBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { isLogin, user } = useSelector(
    (state) => state.loginReducer
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const path = location.pathname.toLowerCase();

  // ADMIN PAGES -> NO HEADER
  if (user?.role === "admin" || path.startsWith("/admin")) {
    return null;
  }

  // =========================
  // PUBLIC HOME / HERO
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
  // LOGIN
  // =========================

  if (path === "/login") {
    return (
      <header className="site-header auth-header">
        <Logo />

        <div className="auth-link">
          <span>Don't have an account?</span>

          <Link to="/signup">
            Sign Up
          </Link>
        </div>
      </header>
    );
  }

  // =========================
  // SIGNUP
  // =========================

  if (path === "/signup") {
    return (
      <header className="site-header auth-header">
        <Logo />

        <div className="auth-link">
          <span>Already have an account?</span>

          <Link to="/login">
            Login
          </Link>
        </div>
      </header>
    );
  }

  // =========================
  // LOGGED-IN USER
  // =========================

  if (isLogin) {
    return (
      <header className="site-header user-header">

        <Logo />

        <nav className="header-nav user-nav">

          <Link
            className={
              path === "/home" || path === "/dashboard"
                ? "active"
                : ""
            }
            to="/dashboard"
          >
            Home
          </Link>

          <Link
            className={
              path.startsWith("/dashboard/states")
                ? "active"
                : ""
            }
            to="/dashboard/states"
          >
            States
          </Link>

          <Link
            className={
              path.startsWith("/dashboard/place")
                ? "active"
                : ""
            }
            to="/dashboard"
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

        <div className="user-menu">

          <button
            type="button"
            className="username-button"
            onClick={() => setDropdownOpen((prev) => !prev)}
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
              className={`arrow ${dropdownOpen ? "rotate" : ""
                }`}
            >
              ▼
            </span>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown">

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await dispatch(logoutUser()).unwrap();
                    setDropdownOpen(false);
                  } catch (error) {
                    console.log("Logout failed:", error);
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

  // =========================
  // UNKNOWN PUBLIC PAGE
  // =========================

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


// =========================================
// LOGO
// =========================================

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