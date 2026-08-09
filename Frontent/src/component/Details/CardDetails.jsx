import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Details } from "./Details";
import socket from "../../socket/socket";

export function CardDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);


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
    // REAL-TIME STATE VISIBILITY
    // =========================================

    useEffect(() => {

        const handleStateVisibilityUpdated =
            (updatedState) => {

                console.log(
                    "State visibility changed:",
                    updatedState
                );


                // State was hidden
                if (
                    updatedState.visible === false &&
                    data?.state_id?.name === updatedState.name
                ) {

                    console.log(
                        "Current place belongs to hidden state."
                    );


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

        return <h2>Loading...</h2>;

    }


    // =========================================
    // DATA NOT FOUND
    // =========================================

    if (!data) {

        return <h1>Data Not Found</h1>;

    }


    return (
        <Details data={data} />
    );

}