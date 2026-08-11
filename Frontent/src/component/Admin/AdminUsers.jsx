import { useEffect, useMemo, useState } from "react";
import socket from "../../socket/socket";

import ConfirmModal from "./ConfirmModal";

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
    // REUSABLE CONFIRMATION MODAL
    // ========================================

    const [confirmAction, setConfirmAction] =
        useState(null);

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

            if (
                !response.ok ||
                !result.status
            ) {
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

    // ========================================
    // SOCKET
    // ========================================

    useEffect(() => {
        fetchUsers();

        const handleUserLoggedIn = (
            loggedInUser
        ) => {
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

                return currentUsers.map(
                    (user) =>
                        user._id ===
                        loggedInUser._id
                            ? {
                                ...user,
                                lastLogin:
                                    loggedInUser.lastLogin,
                            }
                            : user
                );
            });

            setSelectedUser(
                (currentUser) => {
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
                }
            );
        };

        socket.on(
            "userLoggedIn",
            handleUserLoggedIn
        );

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
                currentStatus ===
                    statusFilter;

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

        return new Date(
            date
        ).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // ========================================
    // JOINED DATE
    // ========================================

    const formatJoinedDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(
            date
        ).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // ========================================
    // OPEN CONFIRM MODAL
    // ========================================

    const openConfirmModal = (
        type,
        user
    ) => {
        setConfirmAction({
            type,
            user,
        });
    };

    // ========================================
    // BLOCK / UNBLOCK
    // ========================================

    const handleToggleStatus = async (
        user
    ) => {
        const isBlocked =
            user.status === "blocked";

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

            if (
                !response.ok ||
                !result.status
            ) {
                throw new Error(
                    result.message ||
                        "Failed to update user"
                );
            }

            // Update user
            setUsers((currentUsers) =>
                currentUsers.map(
                    (item) =>
                        item._id === user._id
                            ? result.user
                            : item
                )
            );

            // Update selected user
            if (
                selectedUser?._id ===
                user._id
            ) {
                setSelectedUser(
                    result.user
                );
            }

            // Update stats
            setStats((current) => {
                if (isBlocked) {
                    return {
                        ...current,

                        activeUsers:
                            current.activeUsers +
                            1,

                        blockedUsers:
                            Math.max(
                                0,
                                current.blockedUsers -
                                    1
                            ),
                    };
                }

                return {
                    ...current,

                    activeUsers:
                        Math.max(
                            0,
                            current.activeUsers -
                                1
                        ),

                    blockedUsers:
                        current.blockedUsers +
                        1,
                };
            });

            // Close confirmation modal
            setConfirmAction(null);
        } catch (error) {
            console.log(error);

            setError(
                error.message ||
                    "Something went wrong"
            );

            setConfirmAction(null);

            setTimeout(() => {
                setError("");
            }, 3000);
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================
    // DELETE USER
    // ========================================

    const handleDeleteUser = async () => {
        const user =
            confirmAction?.user;

        if (!user) {
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

            if (
                !response.ok ||
                !result.status
            ) {
                throw new Error(
                    result.message ||
                        "Failed to delete user"
                );
            }

            // Remove user
            setUsers((currentUsers) =>
                currentUsers.filter(
                    (item) =>
                        item._id !==
                        user._id
                )
            );

            // Close selected user modal
            setSelectedUser(null);

            // Update stats
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
                            current.activeUsers -
                                1
                        ),

                blockedUsers:
                    user.status === "blocked"
                        ? Math.max(
                            0,
                            current.blockedUsers -
                                1
                        )
                        : current.blockedUsers,
            }));

            // Close confirmation modal
            setConfirmAction(null);
        } catch (error) {
            console.log(error);

            setError(
                error.message ||
                    "Something went wrong"
            );

            setConfirmAction(null);

            setTimeout(() => {
                setError("");
            }, 3000);
        } finally {
            setActionLoading(false);
        }
    };

    // ========================================
    // VIEW USER
    // ========================================

    const handleViewUser = async (
        user
    ) => {
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

            if (
                !response.ok ||
                !result.status
            ) {
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

            setError(
                error.message ||
                    "Unable to load user"
            );

            setTimeout(() => {
                setError("");
            }, 3000);
        }
    };

    // ========================================
    // CONFIRM MODAL DATA
    // ========================================

    const getConfirmModalData = () => {
        if (!confirmAction) {
            return {};
        }

        const {
            type,
            user,
        } = confirmAction;

        if (type === "delete") {
            return {
                title: "Delete User?",
                message: (
                    <>
                        Are you sure you want to
                        permanently delete{" "}
                        <strong>
                            {user.name}
                        </strong>
                        ?
                    </>
                ),
                warning:
                    "This action cannot be undone.",
                confirmText:
                    "Yes, Delete User",
                icon: "🗑",
                modalType: "danger",
            };
        }

        if (type === "block") {
            return {
                title: "Block User?",
                message: (
                    <>
                        Are you sure you want to
                        block{" "}
                        <strong>
                            {user.name}
                        </strong>
                        ?
                    </>
                ),
                warning:
                    "This user will not be able to access the application.",
                confirmText:
                    "Yes, Block User",
                icon: "⊘",
                modalType: "warning",
            };
        }

        return {
            title: "Unblock User?",
            message: (
                <>
                    Are you sure you want to
                    unblock{" "}
                    <strong>
                        {user.name}
                    </strong>
                    ?
                </>
            ),
            warning:
                "This user will be able to access the application again.",
            confirmText:
                "Yes, Unblock User",
            icon: "✓",
            modalType: "success",
        };
    };

    // ========================================
    // CONFIRM ACTION
    // ========================================

    const handleConfirmAction =
        () => {
            if (!confirmAction) {
                return;
            }

            if (
                confirmAction.type ===
                "delete"
            ) {
                handleDeleteUser();
                return;
            }

            handleToggleStatus(
                confirmAction.user
            );
        };

    const confirmModalData =
        getConfirmModalData();

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
                        onClick={
                            fetchUsers
                        }
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
                        Manage IndiaScape users
                        and monitor their activity.
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
                            {
                                stats.totalUsers
                            }
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
                            {
                                stats.activeUsers
                            }
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
                            {
                                stats.blockedUsers
                            }
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
                            {
                                stats.newUsers
                            }
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
                    onClick={
                        fetchUsers
                    }
                >
                    ↻ Refresh
                </button>

            </div>

            {/* ========================================
                USER CARDS
            ======================================== */}

            <div className="admin-users-grid">

                {filteredUsers.length ===
                0 ? (

                    <div className="admin-users-empty-card">

                        <div>
                            🔎
                        </div>

                        <h3>
                            No users found
                        </h3>

                        <p>
                            Try changing your
                            search or status
                            filter.
                        </p>

                    </div>

                ) : (

                    filteredUsers.map(
                        (user) => {

                            const status =
                                user.status ||
                                "active";

                            const isBlocked =
                                status ===
                                "blocked";

                            return (
                                <article
                                    className="admin-user-card"
                                    key={
                                        user._id
                                    }
                                >

                                    {/* USER HEADER */}

                                    <div className="admin-user-card-header">

                                        <div className="admin-user-card-identity">

                                            <div className="admin-user-avatar">

                                                {user.name
                                                    ?.charAt(
                                                        0
                                                    )
                                                    ?.toUpperCase()}

                                            </div>

                                            <div className="admin-user-card-name">

                                                <h3>
                                                    {
                                                        user.name
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        user.email
                                                    }
                                                </p>

                                            </div>

                                        </div>

                                        <span
                                            className={
                                                `admin-user-status ${status}`
                                            }
                                        >
                                            {
                                                status
                                            }
                                        </span>

                                    </div>

                                    {/* BASIC INFORMATION */}

                                    <div className="admin-user-info-grid">

                                        <div className="admin-user-info-box">

                                            <span>
                                                JOINED
                                            </span>

                                            <strong>
                                                {formatJoinedDate(
                                                    user.createdAt
                                                )}
                                            </strong>

                                        </div>

                                        <div className="admin-user-info-box">

                                            <span>
                                                LAST LOGIN
                                            </span>

                                            <strong
                                                className={
                                                    !user.lastLogin
                                                        ? "never"
                                                        : ""
                                                }
                                            >
                                                {formatDate(
                                                    user.lastLogin
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                    {/* ACTIVITY */}

                                    <div className="admin-user-activity">

                                        <div className="admin-user-activity-item">

                                            <span>
                                                VISITED STATES
                                            </span>

                                            <strong>
                                                {
                                                    user
                                                        .visitedStates
                                                        ?.length ||
                                                    0
                                                }
                                            </strong>

                                        </div>

                                        <div className="admin-user-activity-item">

                                            <span>
                                                FAVORITES
                                            </span>

                                            <strong>
                                                {
                                                    user
                                                        .favoritePlaces
                                                        ?.length ||
                                                    0
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="admin-user-card-actions">

                                        <div className="admin-user-actions-title">

                                            <span>
                                                ACTIONS
                                            </span>

                                        </div>

                                        <div className="admin-user-actions">

                                            {/* VIEW */}

                                            <button
                                                className="admin-action-view"
                                                onClick={() =>
                                                    handleViewUser(
                                                        user
                                                    )
                                                }
                                            >
                                                <span>
                                                    👁
                                                </span>

                                                View User
                                            </button>

                                            {/* BLOCK / UNBLOCK */}

                                            <button
                                                className={
                                                    isBlocked
                                                        ? "admin-action-unblock"
                                                        : "admin-action-block"
                                                }
                                                disabled={
                                                    actionLoading
                                                }
                                                onClick={() =>
                                                    openConfirmModal(
                                                        isBlocked
                                                            ? "unblock"
                                                            : "block",
                                                        user
                                                    )
                                                }
                                            >

                                                <span>
                                                    {isBlocked
                                                        ? "✓"
                                                        : "⊘"}
                                                </span>

                                                {isBlocked
                                                    ? "Unblock"
                                                    : "Block"}

                                            </button>

                                            {/* DELETE */}

                                            <button
                                                className="admin-action-delete"
                                                disabled={
                                                    actionLoading
                                                }
                                                onClick={() =>
                                                    openConfirmModal(
                                                        "delete",
                                                        user
                                                    )
                                                }
                                            >

                                                <span>
                                                    🗑
                                                </span>

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                </article>
                            );
                        }
                    )

                )}

            </div>

            {/* ========================================
                RESULT COUNT
            ======================================== */}

            <div className="admin-users-result-count">

                Showing{" "}

                <strong>
                    {
                        filteredUsers.length
                    }
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
                        setSelectedUser(
                            null
                        )
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
                                setSelectedUser(
                                    null
                                )
                            }
                        >
                            ×
                        </button>

                        {/* PROFILE */}

                        <div className="admin-user-profile">

                            <div className="admin-user-large-avatar">

                                {selectedUser.name
                                    ?.charAt(
                                        0
                                    )
                                    ?.toUpperCase()}

                            </div>

                            <div>

                                <h2>
                                    {
                                        selectedUser.name
                                    }
                                </h2>

                                <p>
                                    {
                                        selectedUser.email
                                    }
                                </p>

                            </div>

                        </div>

                        {/* DETAILS */}

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
                                    {
                                        selectedUser
                                            .visitedStates
                                            ?.length ||
                                        0
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Favorite Places
                                </span>

                                <strong>
                                    {
                                        selectedUser
                                            .favoritePlaces
                                            ?.length ||
                                        0
                                    }
                                </strong>

                            </div>

                        </div>

                        {/* VISITED STATES */}

                        <div className="admin-user-detail-section">

                            <h3>
                                Visited States
                            </h3>

                            {selectedUser
                                .visitedStates
                                ?.length ? (

                                <div className="admin-user-tags">

                                    {selectedUser.visitedStates.map(
                                        (
                                            state
                                        ) => (

                                            <span
                                                key={
                                                    state._id
                                                }
                                            >
                                                {
                                                    state.name
                                                }
                                            </span>

                                        )
                                    )}

                                </div>

                            ) : (

                                <p className="admin-user-no-data">
                                    No states
                                    visited yet.
                                </p>

                            )}

                        </div>

                        {/* FAVORITE PLACES */}

                        <div className="admin-user-detail-section">

                            <h3>
                                Favorite Places
                            </h3>

                            {selectedUser
                                .favoritePlaces
                                ?.length ? (

                                <div className="admin-user-favorite-list">

                                    {selectedUser.favoritePlaces.map(
                                        (
                                            place
                                        ) => (

                                            <div
                                                key={
                                                    place._id
                                                }
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
                                    No favorite
                                    places yet.
                                </p>

                            )}

                        </div>

                        {/* MODAL ACTIONS */}

                        <div className="admin-user-modal-actions">

                            <button
                                className={
                                    selectedUser.status ===
                                    "blocked"
                                        ? "admin-modal-unblock"
                                        : "admin-modal-block"
                                }
                                onClick={() =>
                                    openConfirmModal(
                                        selectedUser.status ===
                                            "blocked"
                                            ? "unblock"
                                            : "block",
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
                                    openConfirmModal(
                                        "delete",
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

            {/* ========================================
                REUSABLE CONFIRM MODAL
            ======================================== */}

            <ConfirmModal
                open={
                    Boolean(
                        confirmAction
                    )
                }

                title={
                    confirmModalData.title
                }

                message={
                    confirmModalData.message
                }

                warning={
                    confirmModalData.warning
                }

                confirmText={
                    confirmModalData.confirmText
                }

                icon={
                    confirmModalData.icon
                }

                type={
                    confirmModalData.modalType
                }

                loading={
                    actionLoading
                }

                onCancel={() =>
                    setConfirmAction(
                        null
                    )
                }

                onConfirm={
                    handleConfirmAction
                }
            />

        </section>
    );
}

export default AdminUsers;