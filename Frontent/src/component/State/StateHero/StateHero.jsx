import "./stateHero.css";

function StateHero({ famous }) {

    const featuredPlace = famous?.[0];

    const getImage = (place) => {

        if (!place) return "";

        if (place.photos?.length > 0) {

            const photo = place.photos[0];

            if (typeof photo === "string") {
                return photo;
            }

            return photo?.url || "";
        }

        return (
            place.image ||
            place.photo ||
            place.imageUrl ||
            ""
        );
    };


    return (
        <section className="state-hero">

            <div className="state-hero-overlay"></div>

            <div className="state-hero-content">

                <span className="state-hero-label">
                    INDIA · ONE JOURNEY · COUNTLESS STORIES
                </span>

                <h1>
                    Explore
                    <span> India</span>
                </h1>

                <p>
                    Discover the colors, culture and
                    breathtaking destinations of every
                    Indian state.
                </p>

                <button
                    className="state-hero-button"
                    onClick={() =>
                        document
                            .getElementById("states-explorer")
                            ?.scrollIntoView({
                                behavior: "smooth"
                            })
                    }
                >
                    Explore States
                    <span>↓</span>
                </button>

            </div>


            {featuredPlace && (

                <div className="featured-place">

                    {getImage(featuredPlace) && (
                        <img
                            src={getImage(featuredPlace)}
                            alt={featuredPlace.name}
                        />
                    )}

                    <div className="featured-place-content">

                        <span>
                            FEATURED DESTINATION
                        </span>

                        <h3>
                            {featuredPlace.name}
                        </h3>

                        <p>
                            {featuredPlace.title ||
                                featuredPlace.description ||
                                "Discover an unforgettable destination."}
                        </p>

                    </div>

                </div>

            )}

        </section>
    );
}

export default StateHero;