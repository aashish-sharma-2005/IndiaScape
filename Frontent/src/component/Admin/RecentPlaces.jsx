import { useNavigate } from "react-router-dom";

function RecentPlaces({ places = [] }) {
    const recentPlaces = places.slice(0, 5);
    const navigate = useNavigate()
    return (

        <section className="dashboard-card recent-card">

            <div className="card-heading">

                <div>
                    <h2>Recently Added Places</h2>
                    <p>Latest destinations added to the platform</p>
                </div>

                <button onClick={() => navigate("/admin/places")}>
                    View All →
                </button>

            </div>

            <div className="recent-list">

                {recentPlaces.map((place) => (

                    <div
                        className="recent-item"
                        key={place._id}
                    >

                        <img
                            src={place.photos?.[0]?.url}
                            alt={place.name}
                        />

                        <div className="recent-info">

                            <strong>
                                {place.name}
                            </strong>

                            <span>
                                {place.title}
                            </span>

                        </div>

                        <div className="published">
                            <i></i>
                            Published
                        </div>

                        <button className="more-btn">
                            ⋮
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );
}

export default RecentPlaces;