import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar({ placesCount, statesCount }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="admin-sidebar">
            <div className="admin-brand">
                <div className="brand-logo">🌏</div>
                <div>
                    <h2>India<span>Scape</span></h2>
                    <small>ADMIN PANEL</small>
                </div>
            </div>

            <div className="admin-user">
                <div className="admin-avatar">AS</div>
                <div>
                    <strong>Aashish Sharma</strong>
                    <span>Administrator</span>
                </div>
                <i></i>
            </div>

            <div className="sidebar-title">MAIN MENU</div>

            <nav className="admin-navigation">
                <button
                    className={location.pathname === "/admin" ? "active" : ""}
                    onClick={() => navigate("/admin")}
                >
                    <span>▦</span>
                    Dashboard
                </button>

                <button
                    className={location.pathname === "/admin/places" ? "active" : ""}
                    onClick={() => navigate("/admin/places")}
                >
                    <span>📍</span>
                    Places
                    <b>{placesCount}</b>
                </button>

                <button
                    className={location.pathname === "/admin/states" ? "active" : ""}
                    onClick={() => navigate("/admin/states")}
                >
                    <span>🗺️</span>
                    States
                    <b>{statesCount}</b>
                </button>

                <button
                    className={location.pathname === "/admin/users" ? "active" : ""}
                    onClick={() => navigate("/admin/users")}
                >
                    <span>👥</span>
                    Users
                </button>

                <button
                    className={location.pathname === "/admin/analytics" ? "active" : ""}
                    onClick={() => navigate("/admin/analytics")}
                >
                    <span>📊</span>
                    Analytics
                </button>
            </nav>

            <div className="sidebar-title">SYSTEM</div>

            <nav className="admin-navigation">
                <button
                    className={location.pathname === "/admin/settings" ? "active" : ""}
                    onClick={() => navigate("/admin/settings")}
                >
                    <span>⚙️</span>
                    Settings
                </button>

                <button onClick={() => navigate("/dashboard")}>
                    <span>↩</span>
                    Back to Website
                </button>
            </nav>

            <div className="sidebar-bottom">
                <div className="india-icon">🕌</div>
                <div>
                    <strong>Explore India</strong>
                    <p>Discover incredible stories.</p>
                </div>
            </div>
        </aside>
    );
}

export default AdminSidebar;