import { createSlice } from "@reduxjs/toolkit";

const placeSlice = createSlice({
    name: "places",

    initialState: {
        featuredPlaces: [],
        loading: false
    },

    reducers: {
        setPlaces: (state, action) => {
            state.featuredPlaces = action.payload;
            state.loading = false;
        },

        setLoading: (state, action) => {
            state.loading = action.payload;
        }
    }
});

export const { setPlaces, setLoading } = placeSlice.actions;

export default placeSlice.reducer;