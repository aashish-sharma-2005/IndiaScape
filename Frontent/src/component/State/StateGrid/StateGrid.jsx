import StateCard from "../StateCard/StateCard";
import "./stateGrid.css";

function StateGrid({ states }) {

    if (!states || states.length === 0) {

        return (
            <div className="no-states">
                <h3>
                    No states found
                </h3>

                <p>
                    More destinations are coming soon.
                </p>
            </div>
        );
    }


    return (
        <div className="state-grid">

            {states.map((state, index) => (

                <StateCard
                    key={state._id || index}
                    state={state}
                    index={index}
                />

            ))}

        </div>
    );
}

export default StateGrid;