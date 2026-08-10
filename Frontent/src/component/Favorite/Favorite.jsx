import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    fetchFavoritePlaces,
    removeFavorite,
} from "../../store/favoriteSlice";

import "./favorite.css";


export function Favorite() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        places,
        loading,
        removing,
        error,
    } = useSelector(
        (state) => state.favorites
    );


    useEffect(() => {

        dispatch(fetchFavoritePlaces());

    }, [dispatch]);


    const handleRemove = (placeId) => {

        dispatch(removeFavorite(placeId));

    };


    const handlePlaceClick = (placeId) => {

        navigate(`/dashboard/place/${placeId}`);

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="favorite-page">

                <div className="favorite-container">

                    <div className="favorite-heading-skeleton"></div>

                    <div className="favorite-grid">

                        {[1, 2, 3, 4].map((item) => (

                            <div
                                className="favorite-skeleton-card"
                                key={item}
                            >

                                <div className="favorite-skeleton-image"></div>

                                <div className="favorite-skeleton-content">

                                    <div className="favorite-skeleton-title"></div>

                                    <div className="favorite-skeleton-text"></div>

                                    <div className="favorite-skeleton-text short"></div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </div>

        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="favorite-page">

                <div className="favorite-empty">

                    <div className="favorite-empty-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="favorite-primary-btn"
                        onClick={() =>
                            dispatch(fetchFavoritePlaces())
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );
    }


    // =========================================
    // EMPTY
    // =========================================

    if (!places || places.length === 0) {

        return (

            <div className="favorite-page">

                <div className="favorite-hero">

                    <div className="favorite-hero-overlay">

                        <div>

                            <span className="favorite-eyebrow">
                                YOUR COLLECTION
                            </span>

                            <h1>
                                My Favorites
                            </h1>

                            <p>
                                Save the places you love and
                                keep your India travel inspiration
                                in one place.
                            </p>

                        </div>

                    </div>

                </div>


                <div className="favorite-empty">

                    <div className="favorite-empty-icon">
                        ♡
                    </div>

                    <h2>
                        No Favorite Places Yet
                    </h2>

                    <p>
                        Start exploring India and save the
                        places you want to visit later.
                    </p>

                    <button
                        className="favorite-primary-btn"
                        onClick={() =>
                            navigate("/dashboard/states")
                        }
                    >
                        Explore Places
                    </button>

                </div>

            </div>

        );
    }


    // =========================================
    // FAVORITES
    // =========================================

    return (

        <div className="favorite-page">

            {/* ================= CONTENT ================= */}

            <main className="favorite-container">

                <div className="favorite-section-heading">

                    <div>

                        <span className="favorite-small-title">
                            SAVED PLACES
                        </span>

                        <h2>
                            Places You Love
                        </h2>

                    </div>

                    <span className="favorite-count">
                        {places.length}{" "}
                        {places.length === 1
                            ? "Place"
                            : "Places"}
                    </span>

                </div>


                {/* ================= GRID ================= */}

                <div className="favorite-grid">

                    {places.map((place) => {

                        const image =
                            place.photos?.[0]?.url ||
                            place.photos?.[0] ||
                            "";

                        const stateName =
                            place.state_id?.name ||
                            "India";


                        return (

                            <article
                                className="favorite-card"
                                key={place._id}
                            >

                                {/* IMAGE */}

                                <div
                                    className="favorite-image-wrapper"
                                    onClick={() =>
                                        handlePlaceClick(
                                            place._id
                                        )
                                    }
                                >

                                    {image ? (

                                        <img
                                            src={image}
                                            alt={place.name}
                                            className="favorite-image"
                                        />

                                    ) : (

                                        <div className="favorite-no-image">
                                            No Image
                                        </div>

                                    )}


                                    <div className="favorite-image-overlay"></div>


                                    {/* REMOVE BUTTON */}

                                    <button
                                        className="favorite-heart-btn"
                                        onClick={(event) => {

                                            event.stopPropagation();

                                            handleRemove(
                                                place._id
                                            );

                                        }}
                                        disabled={removing}
                                        aria-label="Remove from favorites"
                                    >

                                        ❤️

                                    </button>


                                    {/* STATE */}

                                    <span className="favorite-state">

                                        {stateName}

                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="favorite-card-content">

                                    <h3>
                                        {place.name}
                                    </h3>

                                    {place.title && (

                                        <p className="favorite-card-title">
                                            {place.title}
                                        </p>

                                    )}


                                    {place.description && (

                                        <p className="favorite-description">

                                            {place.description}

                                        </p>

                                    )}


                                    <button
                                        className="favorite-view-btn"
                                        onClick={() =>
                                            handlePlaceClick(
                                                place._id
                                            )
                                        }
                                    >

                                        View Place

                                        <span>
                                            →
                                        </span>

                                    </button>

                                </div>

                            </article>

                        );

                    })}

                </div>

            </main>

        </div>

    );
}