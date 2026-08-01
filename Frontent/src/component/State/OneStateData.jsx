import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StateCards } from "./StateCards";

export function OneStateData() {
    const { state } = useParams();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStatePlaces = async () => {
            try {
                const response = await fetch(`http://localhost:3000/dashboard/states/${state}`, {
                    credentials: "include",
                }
                );
                const result = await response.json();
                if (result.status) {
                    setPlaces(result.places);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getStatePlaces();
    }, [state]);
    if (loading) {
        return <h2>Loading...</h2>;
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