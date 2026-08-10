import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Details } from "./Details";
import socket from "../../socket/socket";
import { toast } from "react-toastify";

import { updateUser } from "../../store/loginSlice";


export function CardDetails() {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);


    // =========================================
    // FETCH PLACE
    // =========================================

    useEffect(() => {

        const getPlace = async () => {

            try {

                const response = await fetch(
                    `http://localhost:3000/dashboard/place/${id}`,
                    {
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (result.status) {

                    setData(result.place);

                }

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);

            }

        };

        getPlace();

    }, [id]);


    // =========================================
    // GET CURRENT USER FAVORITES
    // =========================================

    useEffect(() => {

        const getUser = async () => {

            try {

                const response = await fetch(
                    "http://localhost:3000/me",
                    {
                        credentials: "include",
                    }
                );

                const result = await response.json();

                if (result.status) {

                    const favoritePlaces =
                        result.user.favoritePlaces || [];

                    const exists =
                        favoritePlaces.some(
                            (placeId) =>
                                placeId.toString() === id
                        );

                    setIsFavorite(exists);

                }

            } catch (error) {

                console.log(error);

            }

        };

        getUser();

    }, [id]);


    // =========================================
    // TOGGLE FAVORITE
    // =========================================

    const handleFavorite = async () => {

        if (favoriteLoading) return;

        setFavoriteLoading(true);

        try {

            const response = await fetch(
                "http://localhost:3000/dashboard/place/favorite",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        placeId: id
                    })
                }
            );

            const result = await response.json();


            // =========================================
            // SUCCESS
            // =========================================

            if (result.status) {

                // Update local favorite button
                setIsFavorite(result.favorite);


                // =========================================
                // UPDATE REDUX USER
                // =========================================

                dispatch(
                    updateUser({
                        favoritePlaces:
                            result.favoritePlaces
                    })
                );


                toast.success(
                    result.message
                );

            } else {

                toast.error(
                    result.message ||
                    "Something went wrong"
                );

            }

        } catch (error) {

            console.log(error);

            toast.error(
                "Server Error"
            );

        } finally {

            setFavoriteLoading(false);

        }

    };


    // =========================================
    // REAL-TIME STATE VISIBILITY
    // =========================================

    useEffect(() => {

        const handleStateVisibilityUpdated =
            (updatedState) => {

                if (
                    updatedState.visible === false &&
                    data?.state_id?.name ===
                        updatedState.name
                ) {

                    navigate(
                        "/dashboard/states"
                    );

                }

            };


        socket.on(
            "stateVisibilityUpdated",
            handleStateVisibilityUpdated
        );


        return () => {

            socket.off(
                "stateVisibilityUpdated",
                handleStateVisibilityUpdated
            );

        };

    }, [data, navigate]);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    // =========================================
    // DATA NOT FOUND
    // =========================================

    if (!data) {

        return (
            <h1>
                Data Not Found
            </h1>
        );

    }


    // =========================================
    // DETAILS
    // =========================================

    return (

        <Details
            data={data}
            isFavorite={isFavorite}
            favoriteLoading={favoriteLoading}
            onFavorite={handleFavorite}
        />

    );

}