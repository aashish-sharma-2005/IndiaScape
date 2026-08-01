import { useNavigate } from "react-router-dom";

function TopDestinations({ places = [] }) {

    const topPlaces = places.slice(0, 4);
    const navigate = useNavigate()
    return (

        <section className="dashboard-card destinations-card">

            <div className="card-heading">

                <div>
                    <h2>Top Destinations</h2>
                    <p>Popular places on IndiaScape</p>
                </div>

                <button onClick={() => navigate("/admin/places")}>
                    View All →
                </button>

            </div>

            <div className="destination-grid">

                {topPlaces.map((place) => (

                    <div
                        className="destination-item"
                        key={place._id}
                    >

                        <img
                            src={place.photos?.[0]?.url}
                            alt={place.name}
                        />

                        <div className="destination-overlay">

                            <h3>
                                {place.name}
                            </h3>

                            <p>
                                📍 {place.state_id?.name}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default TopDestinations;