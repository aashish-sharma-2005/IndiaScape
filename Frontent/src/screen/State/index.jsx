import { AllStateData } from "../../component/State/AllStateData";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading/";
import { fetchStatesData } from "../../store/statesSlice";

export function States() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error } = useSelector(
        (state) => state.states
    );

    useEffect(() => {
        dispatch(fetchStatesData());
    }, [dispatch]);

    useEffect(() => {
        if (error === "Unauthorized") {
            navigate("/login");
        }
    }, [error, navigate]);

    if (loading) return <Loading />;

    if (error) {
        return (
            <h3 className="text-center text-danger mt-5">
                {error}
            </h3>
        );
    }

    return <AllStateData />;
}