import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Details } from "./Details";

export function CardDetails() {
    const { id } = useParams();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            {data ? <Details data={data} /> : <h1>Data Not Found</h1>}
        </>
    );
}