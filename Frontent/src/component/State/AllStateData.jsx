import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./allStateData.css";

export function AllStateData() {
    const navigate = useNavigate();

    const { famous, states } = useSelector(
        (state) => state.states
    );

    const getPlaces = (stateId) => {
        return famous.filter(
            (item) => item.state_id?._id === stateId
        );
    };

    const availableStates = states.filter(
        (state) => getPlaces(state._id).length > 0
    );

    return (
        <section className="simple-states">

            <h2>Explore Indian States</h2>

            <div className="states-grid">

                {availableStates.map((state) => {

                    const places = getPlaces(state._id);
                    const image = places[0]?.photos?.[0]?.url;

                    if (!image) return null;

                    return (
                        <div
                            key={state._id}
                            className="state-card"
                            onClick={() =>
                                navigate(`/dashboard/states/${state.name}`)
                            }
                        >
                            <img src={image} alt={state.name} />

                            <div className="card-overlay">
                                <h3>{state.name}</h3>
                                <button>Explore More</button>
                            </div>
                        </div>
                    );
                })}

            </div>

        </section>
    );
}