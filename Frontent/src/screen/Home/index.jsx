import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Home } from "../../component/Home";
import { setPlaces, setLoading } from "../../store/placesSlice";

export function HomePage() {

    const dispatch = useDispatch();

    useEffect(() => {

        const getFeaturedPlaces = async () => {

            try {

                dispatch(setLoading(true));

                const response = await fetch(
                    "http://localhost:3000/dashboard",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                const result = await response.json();

                dispatch(setPlaces(result.featuredPlaces));

            } catch (error) {

                console.log(error);

            } finally {

                dispatch(setLoading(false));

            }
        };

        getFeaturedPlaces();

    }, [dispatch]);

    return <Home />;
}