import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function UserRoute({ children }) {
    const { isLogin, user } = useSelector(
        (state) => state.loginReducer
    );

    if (!isLogin) {
        return <Navigate to="/login" replace />;
    }

    if (user?.role !== "user") {
        return <Navigate to="/admin" replace />;
    }

    return children;
}

export default UserRoute;