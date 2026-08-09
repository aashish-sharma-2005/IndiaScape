import { createSlice } from "@reduxjs/toolkit";

const placeSlice = createSlice({
    name: "places",

    initialState: {
        featuredPlaces: [],
        loading: false
    },

    reducers: {

        setPlaces: (state, action) => {
            state.featuredPlaces = action.payload || [];
            state.loading = false;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        // =========================================
        // PLACE ADDED
        // =========================================

        addPlaceRealtime: (state, action) => {

            const place = action.payload;

            // Only featured places are shown
            // in HomeSlider
            if (!place?.featured) {
                return;
            }

            const exists = state.featuredPlaces.some(
                (item) => item._id === place._id
            );

            if (!exists) {
                state.featuredPlaces.push(place);
            }
        },

        // =========================================
        // PLACE UPDATED
        // =========================================

        updatePlaceRealtime: (state, action) => {

            const updatedPlace = action.payload;

            if (!updatedPlace?._id) {
                return;
            }

            const index = state.featuredPlaces.findIndex(
                (item) => item._id === updatedPlace._id
            );

            // If place is no longer featured,
            // remove it from HomeSlider
            if (!updatedPlace.featured) {

                if (index !== -1) {
                    state.featuredPlaces.splice(index, 1);
                }

                return;
            }

            // Place is already featured
            // → update existing data
            if (index !== -1) {

                state.featuredPlaces[index] = updatedPlace;

            }
            // Place became featured
            // → add it to HomeSlider
            else {

                state.featuredPlaces.push(updatedPlace);
            }
        },

        // =========================================
        // PLACE DELETED
        // =========================================

        deletePlaceRealtime: (state, action) => {

            const placeId = action.payload;

            state.featuredPlaces =
                state.featuredPlaces.filter(
                    (item) => item._id !== placeId
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