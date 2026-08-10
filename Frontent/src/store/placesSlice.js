import { createSlice } from "@reduxjs/toolkit";


const placeSlice = createSlice({

    name: "places",

    initialState: {

        // All places
        places: [],

        // Only featured places
        featuredPlaces: [],

        loading: false

    },


    reducers: {

        // =========================================
        // SET ALL PLACES
        // =========================================

        setPlaces: (state, action) => {

            const places =
                action.payload || [];

            state.places = places;

            state.featuredPlaces =
                places.filter(
                    (place) => place.featured
                );

            state.loading = false;

        },


        // =========================================
        // LOADING
        // =========================================

        setLoading: (state, action) => {

            state.loading =
                action.payload;

        },


        // =========================================
        // PLACE ADDED
        // =========================================

        addPlaceRealtime: (state, action) => {

            const place =
                action.payload;

            if (!place?._id) {
                return;
            }


            // Prevent duplicate
            const exists =
                state.places.some(
                    (item) =>
                        item._id === place._id
                );


            if (!exists) {

                state.places.push(place);

            }


            // Add to featured list
            if (place.featured) {

                const featuredExists =
                    state.featuredPlaces.some(
                        (item) =>
                            item._id === place._id
                    );


                if (!featuredExists) {

                    state.featuredPlaces.push(
                        place
                    );

                }

            }

        },


        // =========================================
        // PLACE UPDATED
        // =========================================

        updatePlaceRealtime: (state, action) => {

            const updatedPlace =
                action.payload;


            if (!updatedPlace?._id) {
                return;
            }


            // =========================================
            // UPDATE ALL PLACES
            // =========================================

            const placeIndex =
                state.places.findIndex(
                    (item) =>
                        item._id ===
                        updatedPlace._id
                );


            if (placeIndex !== -1) {

                state.places[placeIndex] =
                    updatedPlace;

            } else {

                state.places.push(
                    updatedPlace
                );

            }


            // =========================================
            // FEATURED LIST
            // =========================================

            const featuredIndex =
                state.featuredPlaces.findIndex(
                    (item) =>
                        item._id ===
                        updatedPlace._id
                );


            // Place is no longer featured
            if (!updatedPlace.featured) {

                if (featuredIndex !== -1) {

                    state.featuredPlaces.splice(
                        featuredIndex,
                        1
                    );

                }

                return;

            }


            // Already featured → update
            if (featuredIndex !== -1) {

                state.featuredPlaces[
                    featuredIndex
                ] = updatedPlace;

            }

            // Became featured → add
            else {

                state.featuredPlaces.push(
                    updatedPlace
                );

            }

        },


        // =========================================
        // PLACE DELETED
        // =========================================

        deletePlaceRealtime: (
            state,
            action
        ) => {

            const placeId =
                action.payload;


            state.places =
                state.places.filter(
                    (item) =>
                        item._id !== placeId
                );


            state.featuredPlaces =
                state.featuredPlaces.filter(
                    (item) =>
                        item._id !== placeId
                );

        }

    }

});


export const {

    setPlaces,
    setLoading,

    addPlaceRealtime,
    updatePlaceRealtime,
    deletePlaceRealtime

} = placeSlice.actions;


export default placeSlice.reducer;