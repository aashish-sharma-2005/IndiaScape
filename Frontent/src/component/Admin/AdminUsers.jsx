import { useEffect, useMemo, useState } from "react";
import socket from "../../socket/socket";

import "./adminUsers.css";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        blockedUsers: 0,
        newUsers: 0,
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [selectedUser, setSelectedUser] =
        useState(null);

    const [actionLoading, setActionLoading] =
        useState(false);

    // ========================================
    // FETCH USERS
    // ========================================

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:3000/admin/users",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (!response.ok || !result.status) {

                throw new Error(
                    result.message ||
                    "Failed to fetch users"
                );

            }

            setUsers(result.users || []);

            setStats(
                result.stats || {
                    totalUsers: 0,
                    activeUsers: 0,
                    blockedUsers: 0,
                    newUsers: 0,
                }
            );

        } catch (error) {

            console.log(error);

            setError(
                error.message ||
                "Unable to load users"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        fetchUsers();

        // ========================================
        // REAL-TIME USER LOGIN
        // ========================================

        const handleUserLoggedIn = (loggedInUser) => {

            console.log(
                "Socket → userLoggedIn:",
                loggedInUser
            );

            setUsers((currentUsers) => {

                const userExists =
                    currentUsers.some(
                        (user) =>
                            user._id ===
                            loggedInUser._id
                    );

                if (!userExists) {
                    return currentUsers;
                }

                return currentUsers.map((user) =>
                    user._id === loggedInUser._id
                        ? {
                            ...user,
                            lastLogin:
                                loggedInUser.lastLogin,
                        }
                        : user
                );

            });

            // ========================================
            // UPDATE SELECTED USER
            // ========================================

            setSelectedUser((currentUser) => {

                if (
                    !currentUser ||
                    currentUser._id !==
                    loggedInUser._id
                ) {
                    return currentUser;
                }

                return {
                    ...currentUser,
                    lastLogin:
                        loggedInUser.lastLogin,
                };

            });

        };

        socket.on(
            "userLoggedIn",
            handleUserLoggedIn
        );

        // ========================================
        // CLEANUP
        // ========================================

        return () => {

            socket.off(
                "userLoggedIn",
                handleUserLoggedIn
            );

        };

    }, []);

    // ========================================
    // FILTER USERS
    // ========================================

    const filteredUsers = useMemo(() => {

        return users.filter((user) => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();

            const matchesSearch =
                !searchValue ||
                user.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                user.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const currentStatus =
                user.status || "active";

            const matchesStatus =
                statusFilter === "all" ||
                currentStatus === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });

    }, [
        users,
        search,
        statusFilter,
    ]);

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (date) => {

        if (!date) {
            return "Never";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };

    // ========================================
    // JOINED DATE
    // ========================================

    const formatJoinedDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ========================================
    // BLOCK / UNBLOCK
    // ========================================

    const handleToggleStatus = async (user) => {

        const isBlocked =
            user.status === "blocked";

        const action =
            isBlocked
                ? "unblock"
                : "block";

        const confirmed =
            window.confirm(
                `Are you sure you want to ${action} ${user.name}?`
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            const response = await fetch(
                `http://localhost:3000/admin/users/${user._id}/status`,
                {
                    method: "PUT",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (!response.ok || !result.status) {

                throw new Error(
                    result.message ||
                    "Failed to update user"
                );

            }

            setUsers((currentUsers) =>
                currentUsers.map((item) =>
                    item._id === user._id
                        ? result.user
                        : item
                )
            );

            if (
                selectedUser?._id === user._id
            ) {

                setSelectedUser(
                    result.user
                );

            }

        } catch (error) {

            console.log(error);

            alert(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setActionLoading(false);

        }
    };

    // ========================================
    // DELETE USER
    // ========================================

    const handleDelete = async (user) => {

        const confirmed =
            window.confirm(
                `Delete ${user.name} permanently?\n\nThis action cannot be undone.`
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(true);

            const response = await fetch(
                `http://localhost:3000/admin/users/${user._id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (!response.ok || !result.status) {

                throw new Error(
                    result.message ||
                    "Failed to delete user"
                );

            }

            setUsers((currentUsers) =>
                currentUsers.filter(
                    (item) =>
                        item._id !== user._id
                )
            );

            setSelectedUser(null);

            setStats((current) => ({
                ...current,
                totalUsers:
                    Math.max(
                        0,
                        current.totalUsers - 1
                    ),
                activeUsers:
                    user.status === "blocked"
                        ? current.activeUsers
                        : Math.max(
                            0,
                            current.activeUsers - 1
                        ),
                blockedUsers:
                    user.status === "blocked"
                        ? Math.max(
                            0,
                            current.blockedUsers - 1
                        )
                        : current.blockedUsers,
            }));

        } catch (error) {

            console.log(error);

            alert(
                error.message ||
                "Something went wrong"
            );

        } finally {

            setActionLoading(false);

        }
    };

    // ========================================
    // VIEW USER
    // ========================================

    const handleViewUser = async (user) => {

        try {

            const response = await fetch(
                `http://localhost:3000/admin/users/${user._id}`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (!response.ok || !result.status) {

                throw new Error(
                    result.message ||
                    "Failed to load user"
                );

            }

            setSelectedUser(
                result.user
            );

        } catch (error) {

            console.log(error);

            alert(
                error.message ||
                "Unable to load user"
            );

        }
    };

    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <section className="admin-users-page">

                <div className="admin-users-loading">

                    <div className="admin-users-spinner" />

                    <p>
                        Loading users...
                    </p>

                </div>

            </section>
        );
    }

    // ========================================
    // ERROR
    // ========================================

    if (error) {

        return (
            <section className="admin-users-page">

                <div className="admin-users-error">

                    <h2>
                        Unable to load users
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchUsers}
                    >
                        Try Again
                    </button>

                </div>

            </section>
        );
    }

    return (
        <section className="admin-users-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <div className="admin-users-header">

                <div>

                    <span className="admin-users-eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        Manage IndiaScape users and
                        monitor their activity.
                    </p>

                </div>

            </div>

            {/* ========================================
                STATS
            ======================================== */}

            <div className="admin-user-stats">

                <div className="admin-user-stat-card">

                    <div className="admin-user-stat-icon">
                        👥
                    </div>

                    <div>
                        <span>
                            Total Users
                        </span>

                        <strong>
                            {stats.totalUsers}
                        </strong>
                    </div>

                </div>

                <div className="admin-user-stat-card">

                    <div className="admin-user-stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>
                            Active Users
                        </span>

                        <strong>
                            {stats.activeUsers}
                        </strong>
                    </div>

                </div>

                <div className="admin-user-stat-card">

                    <div className="admin-user-stat-icon">
                        ●
                    </div>

                    <div>
                        <span>
                            Blocked Users
                        </span>

                        <strong>
                            {stats.blockedUsers}
                        </strong>
                    </div>

                </div>

                <div className="admin-user-stat-card">

                    <div className="admin-user-stat-icon">
                        ✦
                    </div>

                    <div>
                        <span>
                            New Users
                        </span>

                        <strong>
                            {stats.newUsers}
                        </strong>

                        <small>
                            Last 30 days
                        </small>
                    </div>

                </div>

            </div>

            {/* ========================================
                CONTROLS
            ======================================== */}

            <div className="admin-users-controls">

                <div className="admin-users-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                </div>

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value
                        )
                    }
                >

                    <option value="all">
                        All Users
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="blocked">
                        Blocked
                    </option>

                </select>

                <button
                    className="admin-users-refresh"
                    onClick={fetchUsers}
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ========================================
                TABLE
            ======================================== */}

            <div className="admin-users-table-wrapper">

                <table className="admin-users-table">

                    <thead>

                        <tr>

                            <th>
                                USER
                            </th>

                            <th>
                                EMAIL
                            </th>

                            <th>
                                JOINED
                            </th>

                            <th>
                                LAST LOGIN
                            </th>

                            <th>
                                VISITED
                            </th>

                            <th>
                                FAVORITES
                            </th>

                            <th>
                                STATUS
                            </th>

                            <th>
                                ACTION
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="admin-users-empty"
                                >
                                    No users found.
                                </td>

                            </tr>

                        ) : (

                            filteredUsers.map((user) => {

                                const status =
                                    user.status ||
                                    "active";

                                return (
                                    <tr
                                        key={user._id}
                                    >

                                        <td>

                                            <div className="admin-user-name">

                                                <div className="admin-user-avatar">

                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <strong>
                                                    {user.name}
                                                </strong>

                                            </div>

                                        </td>

                                        <td>
                                            {user.email}
                                        </td>

                                        <td>
                                            {formatJoinedDate(
                                                user.createdAt
                                            )}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    user.lastLogin
                                                        ? "admin-last-login"
                                                        : "admin-last-login never"
                                                }
                                            >
                                                {formatDate(
                                                    user.lastLogin
                                                )}
                                            </span>

                                        </td>

                                        <td>

                                            <span className="admin-user-count">

                                                {user.visitedStates
                                                    ?.length || 0}

                                            </span>

                                        </td>

                                        <td>

                                            <span className="admin-user-count">

                                                {user.favoritePlaces
                                                    ?.length || 0}

                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`admin-user-status ${status}`}
                                            >
                                                {status}
                                            </span>

                                        </td>

                                        <td>

                                            <div className="admin-user-actions">

                                                <button
                                                    className="admin-action-view"
                                                    onClick={() =>
                                                        handleViewUser(
                                                            user
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className={
                                                        status ===
                                                            "blocked"
                                                            ? "admin-action-unblock"
                                                            : "admin-action-block"
                                                    }
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            user
                                                        )
                                                    }
                                                >
                                                    {status ===
                                                        "blocked"
                                                        ? "Unblock"
                                                        : "Block"}
                                                </button>

                                                <button
                                                    className="admin-action-delete"
                                                    disabled={
                                                        actionLoading
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            user
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                );
                            })
                        )}

                    </tbody>

                </table>

            </div>

            {/* ========================================
                RESULT COUNT
            ======================================== */}

            <div className="admin-users-result-count">

                Showing{" "}
                <strong>
                    {filteredUsers.length}
                </strong>{" "}
                of{" "}
                <strong>
                    {users.length}
                </strong>{" "}
                users

            </div>

            {/* ========================================
                USER DETAILS MODAL
            ======================================== */}

            {selectedUser && (

                <div
                    className="admin-user-modal-overlay"
                    onClick={() =>
                        setSelectedUser(null)
                    }
                >

                    <div
                        className="admin-user-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="admin-user-modal-close"
                            onClick={() =>
                                setSelectedUser(null)
                            }
                        >
                            ×
                        </button>

                        <div className="admin-user-profile">

                            <div className="admin-user-large-avatar">

                                {selectedUser.name
                                    ?.charAt(0)
                                    ?.toUpperCase()}

                            </div>

                            <div>

                                <h2>
                                    {selectedUser.name}
                                </h2>

                                <p>
                                    {selectedUser.email}
                                </p>

                            </div>

                        </div>

                        <div className="admin-user-detail-grid">

                            <div>

                                <span>
                                    Joined
                                </span>

                                <strong>
                                    {formatJoinedDate(
                                        selectedUser.createdAt
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Last Login
                                </span>

                                <strong>
                                    {formatDate(
                                        selectedUser.lastLogin
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Visited States
                                </span>

                                <strong>
                                    {selectedUser
                                        .visitedStates
                                        ?.length || 0}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Favorite Places
                                </span>

                                <strong>
                                    {selectedUser
                                        .favoritePlaces
                                        ?.length || 0}
                                </strong>

                            </div>

                        </div>

                        <div className="admin-user-detail-section">

                            <h3>
                                Visited States
                            </h3>

                            {selectedUser.visitedStates
                                ?.length ? (

                                <div className="admin-user-tags">

                                    {selectedUser.visitedStates.map(
                                        (state) => (

                                            <span
                                                key={state._id}
                                            >
                                                {state.name}
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="admin-user-no-data">
                                    No states visited yet.
                                </p>

                            )}

                        </div>

                        <div className="admin-user-detail-section">

                            <h3>
                                Favorite Places
                            </h3>

                            {selectedUser.favoritePlaces
                                ?.length ? (

                                <div className="admin-user-favorite-list">

                                    {selectedUser.favoritePlaces.map(
                                        (place) => (

                                            <div
                                                key={place._id}
                                                className="admin-user-favorite-item"
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            place.name ||
                                                            place.title
                                                        }
                                                    </strong>

                                                    {place.title &&
                                                        place.name && (
                                                            <span>
                                                                {
                                                                    place.title
                                                                }
                                                            </span>
                                                        )}

                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="admin-user-no-data">
                                    No favorite places yet.
                                </p>

                            )}

                        </div>

                        <div className="admin-user-modal-actions">

                            <button
                                className={
                                    selectedUser.status ===
                                        "blocked"
                                        ? "admin-modal-unblock"
                                        : "admin-modal-block"
                                }
                                onClick={() =>
                                    handleToggleStatus(
                                        selectedUser
                                    )
                                }
                            >
                                {selectedUser.status ===
                                    "blocked"
                                    ? "Unblock User"
                                    : "Block User"}
                            </button>

                            <button
                                className="admin-modal-delete"
                                onClick={() =>
                                    handleDelete(
                                        selectedUser
                                    )
                                }
                            >
                                Delete User
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </section>
    );
}

export default AdminUsers;