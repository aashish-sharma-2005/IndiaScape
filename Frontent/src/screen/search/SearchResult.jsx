import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import "./searchResult.css";


// =====================================================
// SEARCH RESULTS
// =====================================================

const SearchResults = () => {

    const [searchParams] = useSearchParams();

    const query =
        searchParams.get("q")?.trim() || "";


    // =================================================
    // REDUX DATA
    // =================================================

    const reduxPlaces =
        useSelector(
            (state) =>
                state.places?.places || []
        );


    const famousPlaces =
        useSelector(
            (state) =>
                state.states?.famous || []
        );


    const states =
        useSelector(
            (state) =>
                state.states?.states || []
        );


    // =================================================
    // CREATE CURRENT PLACE DATA
    //
    // placesSlice contains realtime updates.
    // statesSlice.famous contains initially fetched data.
    //
    // If the same place exists in both:
    // placesSlice version wins.
    // =================================================

    const allPlaces = useMemo(() => {

        const placeMap = new Map();


        // ---------------------------------------------
        // FIRST: INITIAL DATA
        // ---------------------------------------------

        famousPlaces.forEach((place) => {

            if (place?._id) {

                placeMap.set(
                    place._id,
                    place
                );

            }

        });


        // ---------------------------------------------
        // SECOND: REALTIME DATA
        //
        // This overwrites old data.
        // ---------------------------------------------

        reduxPlaces.forEach((place) => {

            if (place?._id) {

                placeMap.set(
                    place._id,
                    place
                );

            }

        });


        return Array.from(
            placeMap.values()
        );

    }, [
        famousPlaces,
        reduxPlaces
    ]);


    // =================================================
    // SEARCH
    // =================================================

    const searchResults = useMemo(() => {

        if (!query) {
            return [];
        }


        const searchText =
            query.toLowerCase();


        return allPlaces.filter(
            (place) => {

                // -------------------------------------
                // PLACE NAME
                // -------------------------------------

                const placeName =
                    place.name || "";


                // -------------------------------------
                // TITLE
                // -------------------------------------

                const title =
                    place.title || "";


                // -------------------------------------
                // DESCRIPTION
                // -------------------------------------

                const description =
                    place.description || "";


                // -------------------------------------
                // STATE
                //
                // state_id can be:
                //
                // populated object
                // OR
                // ObjectId/string
                // -------------------------------------

                let stateName = "";


                if (
                    place.state_id &&
                    typeof place.state_id === "object"
                ) {

                    stateName =
                        place.state_id.name || "";

                }


                // -------------------------------------
                // IF state_id IS STRING
                // FIND CURRENT STATE FROM REDUX
                // -------------------------------------

                if (
                    !stateName &&
                    place.state_id
                ) {

                    const stateId =
                        place.state_id.toString();


                    const state =
                        states.find(
                            (item) =>
                                item?._id?.toString() ===
                                stateId
                        );


                    stateName =
                        state?.name || "";

                }


                // -------------------------------------
                // SEARCH ALL FIELDS
                // -------------------------------------

                return (
                    placeName
                        .toLowerCase()
                        .includes(searchText) ||

                    title
                        .toLowerCase()
                        .includes(searchText) ||

                    description
                        .toLowerCase()
                        .includes(searchText) ||

                    stateName
                        .toLowerCase()
                        .includes(searchText)
                );

            }
        );

    }, [
        query,
        allPlaces,
        states
    ]);


    // =================================================
    // IMAGE HELPER
    // =================================================

    const getPlaceImage = (place) => {

        const photo =
            place?.photos?.[0];


        if (!photo) {
            return "";
        }


        if (typeof photo === "string") {
            return photo;
        }


        return photo.url || "";

    };


    // =================================================
    // EMPTY QUERY
    // =================================================

    if (!query) {

        return (

            <section className="search-page">

                <div className="search-empty">

                    <div className="search-empty-icon">
                        🔍
                    </div>

                    <h2>
                        Search IndiaScape
                    </h2>

                    <p>
                        Search for places, states,
                        titles or descriptions.
                    </p>

                </div>

            </section>

        );

    }


    // =================================================
    // RENDER
    // =================================================

    return (

        <section className="search-page">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="search-page-header">

                <span>
                    Search results for
                </span>

                <h1>
                    "{query}"
                </h1>

                <p>
                    {searchResults.length}{" "}
                    {searchResults.length === 1
                        ? "place"
                        : "places"}{" "}
                    found
                </p>

            </div>


            {/* =========================================
                NO RESULTS
            ========================================= */}

            {searchResults.length === 0 && (

                <div className="search-no-results">

                    <div className="search-no-results-icon">
                        🔍
                    </div>

                    <h2>
                        No places found
                    </h2>

                    <p>
                        We couldn't find anything
                        matching "{query}".
                    </p>

                    <Link
                        to="/dashboard"
                        className="search-back-button"
                    >
                        Back to Home
                    </Link>

                </div>

            )}


            {/* =========================================
                RESULTS
            ========================================= */}

            {searchResults.length > 0 && (

                <div className="search-results-grid">

                    {searchResults.map(
                        (place) => {

                            const image =
                                getPlaceImage(
                                    place
                                );


                            let stateName = "";


                            if (
                                place.state_id &&
                                typeof place.state_id ===
                                    "object"
                            ) {

                                stateName =
                                    place.state_id.name ||
                                    "";

                            }


                            if (
                                !stateName &&
                                place.state_id
                            ) {

                                const state =
                                    states.find(
                                        (item) =>
                                            item?._id?.toString() ===
                                            place.state_id?.toString()
                                    );


                                stateName =
                                    state?.name || "";

                            }


                            return (

                                <Link
                                    key={place._id}
                                    to={`/dashboard/place/${place._id}`}
                                    className="search-result-card"
                                >

                                    {/* IMAGE */}

                                    <div className="search-result-image">

                                        {image ? (

                                            <img
                                                src={image}
                                                alt={
                                                    place.name ||
                                                    "Place"
                                                }
                                            />

                                        ) : (

                                            <div className="search-result-no-image">
                                                IndiaScape
                                            </div>

                                        )}

                                    </div>


                                    {/* CONTENT */}

                                    <div className="search-result-content">

                                        <h3>
                                            {place.name ||
                                                "Unnamed Place"}
                                        </h3>


                                        {stateName && (

                                            <span className="search-result-state">
                                                📍 {stateName}
                                            </span>

                                        )}


                                        {place.title && (

                                            <p className="search-result-title">
                                                {place.title}
                                            </p>

                                        )}


                                        {place.description && (

                                            <p className="search-result-description">

                                                {place.description.length >
                                                120
                                                    ? `${place.description.slice(
                                                          0,
                                                          120
                                                      )}...`
                                                    : place.description}

                                            </p>

                                        )}

                                    </div>

                                </Link>

                            );

                        }
                    )}

                </div>

            )}

        </section>

    );

};


export default SearchResults;