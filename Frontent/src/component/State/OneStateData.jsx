import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { StateCards } from "./StateCards";
import { visitState } from "../../store/loginSlice";
import {
    placeUpdatedRealtime,
    deletePlaceRealtime
} from "../../store/statesSlice";

import socket from "../../socket/socket";

export function OneStateData() {

    const { state } = useParams();
    const dispatch = useDispatch();

    const { states, famous } = useSelector(
        (state) => state.states
    );


    // =========================================
    // CURRENT STATE
    // =========================================

    const currentState = states.find(
        (item) => item.name === state
    );


    // =========================================
    // PLACES OF CURRENT STATE
    // =========================================

    const places = famous.filter(
        (item) =>
            item.state_id?._id ===
            currentState?._id
    );


    // =========================================
    // VISIT STATE
    // =========================================

    useEffect(() => {

        if (currentState?._id) {

            dispatch(
                visitState(
                    currentState._id
                )
            );

        }

    }, [currentState?._id, dispatch]);


    // =========================================
    // REALTIME PLACE UPDATE
    // =========================================

    useEffect(() => {

        const handlePlaceUpdated = (payload) => {

            const updatedPlace =
                payload?.place || payload;


            if (!updatedPlace?._id) {
                return;
            }


            console.log(
                "State page place updated:",
                updatedPlace
            );


            dispatch(
                placeUpdatedRealtime(
                    updatedPlace
                )
            );

        };


        socket.on(
            "placeUpdated",
            handlePlaceUpdated
        );


        return () => {

            socket.off(
                "placeUpdated",
                handlePlaceUpdated
            );

        };

    }, [dispatch]);


    // =========================================
    // REALTIME PLACE DELETE
    // =========================================

    useEffect(() => {

        const handlePlaceDeleted = (payload) => {

            const placeId =
                payload?._id ||
                payload;


            if (!placeId) {
                return;
            }


            dispatch(
                deletePlaceRealtime(
                    placeId
                )
            );

        };


        socket.on(
            "placeDeleted",
            handlePlaceDeleted
        );


        return () => {

            socket.off(
                "placeDeleted",
                handlePlaceDeleted
            );

        };

    }, [dispatch]);


    // =========================================
    // STATE NOT FOUND
    // =========================================

    if (!currentState) {

        return (
            <h1>
                State Not Found
            </h1>
        );

    }


    // =========================================
    // NO PLACES
    // =========================================

    if (!places.length) {

        return (
            <h1>
                Data Not Found
            </h1>
        );

    }


    // =========================================
    // STATE PLACES
    // =========================================

    return (
        <StateCards
            places={places}
        />
    );

}