import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { StateCards } from "./StateCards";
import { visitState } from "../../store/loginSlice";

export function OneStateData() {

    const { state } = useParams();
    const dispatch = useDispatch();

    const { states, famous } = useSelector(
        (state) => state.states
    );

    const currentState = states.find(
        (item) => item.name === state
    );

    const places = famous.filter(
        (item) => item.state_id?._id === currentState?._id
    );

    useEffect(() => {
        if (currentState?._id) {
            dispatch(visitState(currentState._id));
        }
    }, [currentState?._id, dispatch]);

    if (!currentState) {
        return <h1>State Not Found</h1>;
    }

    return (
        <>
            {places.length ? (
                <StateCards places={places} />
            ) : (
                <h1>Data Not Found</h1>
            )}
        </>
    );
}