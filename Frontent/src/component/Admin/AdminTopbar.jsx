import { useDispatch } from "react-redux";
import { logout } from "../../store/loginSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminTopbar({ user }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch(
                "http://localhost:3000/logout",
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const result = await response.json();

            if (result.status) {
                dispatch(logout());
                toast.success("Logout Successful");
                navigate("/login");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    };
    return (
        <header className="admin-topbar">

            <div>

                <p className="topbar-greeting">
                    GOOD MORNING, ADMIN 👋
                </p>

                <h1>
                    Dashboard Overview
                </h1>

                <p className="topbar-description">
                    Here's what's happening across IndiaScape today.
                </p>

            </div>

            <div className="topbar-actions">

                <button className="notification">
                    🔔
                    <span></span>
                </button>


                <div className="top-profile">

                    <div className="top-profile-avatar">
                        {user?.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                        <strong>{user.name}</strong>
                        <small>{user.role}</small>
                    </div>

                    <b>⌄</b>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

        </header>
    );
}

export default AdminTopbar;