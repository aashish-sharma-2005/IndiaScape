import { useState } from "react";

function PlacesManagement({ places = [] }) {

    const [search, setSearch] = useState("");

    const filteredPlaces = places.filter((place) => {

        const value = search.toLowerCase();

        return (
            place.name?.toLowerCase().includes(value) ||
            place.title?.toLowerCase().includes(value) ||
            place.state_id?.name?.toLowerCase().includes(value)
        );

    });


    return (

        <section className="dashboard-card management-card">

            <div className="card-heading">

                <div>
                    <h2>Manage Places</h2>
                    <p>Search your destinations</p>
                </div>

            </div>


            <div className="admin-search">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search places..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />


                {search && (

                    <button
                        onClick={() => setSearch("")}
                    >
                        ×
                    </button>

                )}

            </div>


            <div className="management-list">

                {filteredPlaces.slice(0, 8).map((place) => (

                    <div
                        className="management-item"
                        key={place._id}
                    >

                        <img
                            src={
                                place.photos?.[0]?.url ||
                                "/default-place.png"
                            }
                            alt={place.name}
                        />


                        <div>

                            <strong>
                                {place.name}
                            </strong>

                            <span>
                                {place.state_id?.name}
                            </span>

                        </div>


                    </div>

                ))}


                {filteredPlaces.length === 0 && (

                    <div className="empty-search">
                        🔎
                        <p>No place found</p>
                    </div>

                )}

            </div>

        </section>

    );
}

export default PlacesManagement;