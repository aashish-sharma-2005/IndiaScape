import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserRoute({ children }) {

    const {
        isLogin,
        user,
    } = useSelector(
        (state) => state.loginReducer
    );

    // ========================================
    // NOT LOGGED IN
    // ========================================

    if (!isLogin) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    // ========================================
    // ADMIN TRYING USER ROUTE
    // ========================================

    if (user?.role !== "user") {

        return (
            <Navigate
                to="/admin"
                replace
            />
        );

    }

    // ========================================
    // USER ALLOWED
    // ========================================

    return children;
}

export default UserRoute;