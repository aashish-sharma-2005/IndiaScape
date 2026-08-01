import { useMemo, useState } from "react";
import "./admin.css";

function Admin({ places = [] }) {
    const [search, setSearch] = useState("");
    const [activeMenu, setActiveMenu] = useState("Places");

    const filteredPlaces = useMemo(() => {
        const value = search.toLowerCase().trim();

        if (!value) return places;

        return places.filter((place) =>
            place.name?.toLowerCase().includes(value) ||
            place.title?.toLowerCase().includes(value) ||
            place.state_id?.name?.toLowerCase().includes(value)
        );
    }, [places, search]);

    return (
        <div className="admin-dashboard">

            {/* SIDEBAR */}
            <aside className="admin-sidebar">

                <div className="admin-brand">
                    <div className="brand-icon">🌏</div>
                    <div>
                        <h2>India<span>Scape</span></h2>
                        <small>ADMIN PANEL</small>
                    </div>
                </div>

                <div className="admin-profile">
                    <div className="admin-avatar">AS</div>
                    <div>
                        <strong>Admin</strong>
                        <small>Super Administrator</small>
                    </div>
                    <span className="online-dot"></span>
                </div>

                <div className="menu-title">MAIN MENU</div>

                <nav className="admin-menu">

                    <button
                        className={activeMenu === "Dashboard" ? "active" : ""}
                        onClick={() => setActiveMenu("Dashboard")}
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className={activeMenu === "Places" ? "active" : ""}
                        onClick={() => setActiveMenu("Places")}
                    >
                        <span>📍</span>
                        Places
                        <b>{places.length}</b>
                    </button>

                    <button
                        className={activeMenu === "States" ? "active" : ""}
                        onClick={() => setActiveMenu("States")}
                    >
                        <span>🗺️</span>
                        States
                    </button>

                    <button
                        className={activeMenu === "Users" ? "active" : ""}
                        onClick={() => setActiveMenu("Users")}
                    >
                        <span>👥</span>
                        Users
                    </button>

                </nav>

                <div className="menu-title">SYSTEM</div>

                <nav className="admin-menu">

                    <button>
                        <span>⚙️</span>
                        Settings
                    </button>

                    <button className="logout-menu">
                        <span>↪</span>
                        Logout
                    </button>

                </nav>

                <div className="sidebar-footer">
                    <div className="footer-globe">🌍</div>
                    <p>Explore India.<br />Discover Stories.</p>
                </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="admin-main">

                {/* TOPBAR */}
                <header className="admin-topbar">

                    <div>
                        <p className="welcome-text">GOOD MORNING, ADMIN 👋</p>
                        <h1>Overview</h1>
                        <p className="page-description">
                            Manage and explore India's most famous destinations.
                        </p>
                    </div>

                    <div className="topbar-right">

                        <button className="notification-btn">
                            🔔
                            <span></span>
                        </button>

                        <div className="top-admin">
                            <div className="top-avatar">AS</div>
                            <div>
                                <strong>Aashish Sharma</strong>
                                <small>Administrator</small>
                            </div>
                            <b>⌄</b>
                        </div>

                    </div>

                </header>

                {/* STATS */}
                <section className="stats-grid">

                    <div className="stat-card orange-card">
                        <div className="stat-icon">📍</div>
                        <div className="stat-content">
                            <span>Total Places</span>
                            <strong>{places.length}</strong>
                            <small>All destinations</small>
                        </div>
                        <div className="stat-decoration">✦</div>
                    </div>

                    <div className="stat-card purple-card">
                        <div className="stat-icon">🗺️</div>
                        <div className="stat-content">
                            <span>States Covered</span>
                            <strong>28</strong>
                            <small>Across India</small>
                        </div>
                        <div className="stat-decoration">✦</div>
                    </div>

                    <div className="stat-card green-card">
                        <div className="stat-icon">👁️</div>
                        <div className="stat-content">
                            <span>Total Views</span>
                            <strong>12.8K</strong>
                            <small>+18.4% this month</small>
                        </div>
                        <div className="stat-decoration">✦</div>
                    </div>

                    <div className="stat-card blue-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <span>Registered Users</span>
                            <strong>1,248</strong>
                            <small>+12.5% this month</small>
                        </div>
                        <div className="stat-decoration">✦</div>
                    </div>

                </section>

                {/* PLACES SECTION */}
                <section className="places-section">

                    <div className="section-header">

                        <div>
                            <div className="section-title">
                                <h2>Famous Destinations</h2>
                                <span>{filteredPlaces.length}</span>
                            </div>
                            <p>Manage all tourist destinations listed on IndiaScape.</p>
                        </div>

                        <button className="add-place-btn">
                            <span>＋</span>
                            Add New Place
                        </button>

                    </div>

                    {/* SEARCH + FILTER */}
                    <div className="tools-row">

                        <div className="admin-search">

                            <span>⌕</span>

                            <input
                                type="text"
                                placeholder="Search by place, title or state..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {search && (
                                <button
                                    className="clear-search"
                                    onClick={() => setSearch("")}
                                >
                                    ×
                                </button>
                            )}

                        </div>

                        <button className="filter-btn">
                            ☷ Filter
                        </button>

                        <button className="sort-btn">
                            Sort: Latest⌄
                        </button>

                    </div>

                    {/* TABLE HEADER */}
                    <div className="places-table">

                        <div className="table-header">
                            <span>DESTINATION</span>
                            <span>STATE</span>
                            <span>STATUS</span>
                            <span>ACTIONS</span>
                        </div>

                        {filteredPlaces.length > 0 ? (

                            filteredPlaces.map((place) => (

                                <div className="place-row" key={place._id}>

                                    <div className="destination">

                                        <img
                                            src={place.image_urls?.[0]}
                                            alt={place.name}
                                        />

                                        <div>
                                            <strong>{place.name}</strong>
                                            <small>{place.title}</small>
                                        </div>

                                    </div>

                                    <div className="state-column">
                                        <span>📍</span>
                                        {place.state_id?.name || "India"}
                                    </div>

                                    <div>
                                        <span className="status-badge">
                                            <i></i>
                                            Published
                                        </span>
                                    </div>

                                    <div className="action-buttons">

                                        <button
                                            className="view-btn"
                                            title="View"
                                        >
                                            👁
                                        </button>

                                        <button
                                            className="edit-btn"
                                            title="Edit"
                                        >
                                            ✎
                                        </button>

                                        <button
                                            className="delete-btn"
                                            title="Delete"
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>

                            ))

                        ) : (

                            <div className="no-result">

                                <div>🔎</div>

                                <h3>No destination found</h3>

                                <p>
                                    Try searching with another place or state name.
                                </p>

                            </div>

                        )}

                    </div>

                    {/* FOOTER */}
                    {filteredPlaces.length > 0 && (

                        <div className="table-footer">

                            <span>
                                Showing <b>{filteredPlaces.length}</b> of <b>{places.length}</b> destinations
                            </span>

                            <div className="pagination">
                                <button>‹</button>
                                <button className="current">1</button>
                                <button>2</button>
                                <button>3</button>
                                <button>›</button>
                            </div>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Admin;