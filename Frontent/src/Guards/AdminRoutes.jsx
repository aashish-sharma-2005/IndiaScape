import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
    const isLogin = useSelector(
        (state) => state.loginReducer.isLogin
    );

    const user = useSelector(
        (state) => state.loginReducer.user
    );

    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default AdminRoute;