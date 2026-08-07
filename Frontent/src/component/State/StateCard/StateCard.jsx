import { useNavigate } from "react-router-dom";
import "./stateCard.css";

function StateCard({ state }) {

    const navigate = useNavigate(); 
    const getImage = () => {

        if (state?.photos?.length > 0) {

            const photo = state.photos[0];

            if (typeof photo === "string") {
                return photo;
            }

            return photo?.url || "";
        }

        return (
            state?.image ||
            state?.photo ||
            state?.imageUrl ||
            state?.photoUrl ||
            ""
        );
    };

    const image = getImage();

    const handleExplore = () => {
        navigate(
            `/dashboard/states/${encodeURIComponent(state.name)}`
        );
    };

    return (
        <article className="state-card">

            <div className="state-card-image">

                {image ? (
                    <img
                        src={image}
                        alt={state.name}
                    />
                ) : (
                    <div className="state-image-placeholder">
                        IndiaScape
                    </div>
                )}

                <div className="state-card-overlay"></div>

            </div>


            <div className="state-card-content">

                <h3>
                    {state.name}
                </h3>

                {state.description && (
                    <p>
                        {state.description}
                    </p>
                )}

            </div>


            <div className="state-card-footer">

                <span>
                    Discover destination
                </span>

                <button onClick={handleExplore}>
                    Explore
                    <span>→</span>
                </button>

            </div>

        </article>
    );
}

export default StateCard;