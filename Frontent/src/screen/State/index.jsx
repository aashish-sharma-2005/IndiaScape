import { AllStateData } from "../../component/State/AllStateData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loading from "../Loading/";

export function States() {
    const navigate = useNavigate();
    const [famous, setFamous] = useState([]);
    const [states, setStates] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch("http://localhost:3000/dashboard/states", {
                    method: "GET",
                    credentials: "include"
                });
                const result = await response.json();
                if (response.status === 401) return navigate("/login");
                if (!response.ok || !result.status) {
                    setError(result.message || "Something went wrong");
                    return;
                }
                setFamous(result.places || []);
                setStates(result.states || []);
            } catch (error) {
                console.log(error);
                setError("Server Error");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [navigate]);

    if (loading) return <Loading />;

    return error ? (
        <h3 className="text-center text-danger mt-5">{error}</h3>
    ) : (
        <AllStateData famous={famous} states={states} />
    );
}