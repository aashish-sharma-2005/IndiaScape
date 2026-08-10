import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// =========================================
// FETCH FAVORITE PLACES
// =========================================

export const fetchFavoritePlaces = createAsyncThunk(
    "favorites/fetchFavoritePlaces",
    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                "http://localhost:3000/dashboard/place/favorites",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    result.message || "Failed to fetch favorites"
                );
            }

            return result.favoritePlaces;

        } catch (error) {

            return rejectWithValue(
                "Unable to connect to server"
            );
        }
    }
);


// =========================================
// REMOVE FAVORITE
// =========================================

export const removeFavorite = createAsyncThunk(
    "favorites/removeFavorite",
    async (placeId, { rejectWithValue }) => {

        try {

            const response = await fetch(
                "http://localhost:3000/dashboard/place/favorite",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",

                    body: JSON.stringify({
                        placeId,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    result.message || "Failed to remove favorite"
                );
            }

            return {
                placeId,
                ...result,
            };

        } catch (error) {

            return rejectWithValue(
                "Unable to connect to server"
            );
        }
    }
);


// =========================================
// SLICE
// =========================================

const favoriteSlice = createSlice({

    name: "favorites",

    initialState: {
        places: [],
        loading: false,
        removing: false,
        error: null,
    },

    reducers: {

        clearFavorites: (state) => {
            state.places = [];
        },

    },

    extraReducers: (builder) => {

        builder

            // ==============================
            // FETCH
            // ==============================

            .addCase(
                fetchFavoritePlaces.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;

                }
            )

            .addCase(
                fetchFavoritePlaces.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.places = action.payload || [];

                }
            )

            .addCase(
                fetchFavoritePlaces.rejected,
                (state, action) => {

                    state.loading = false;
                    state.error = action.payload;

                }
            )


            // ==============================
            // REMOVE
            // ==============================

            .addCase(
                removeFavorite.pending,
                (state) => {

                    state.removing = true;

                }
            )

            .addCase(
                removeFavorite.fulfilled,
                (state, action) => {

                    state.removing = false;

                    state.places = state.places.filter(
                        (place) =>
                            place._id !== action.payload.placeId
                    );

                }
            )

            .addCase(
                removeFavorite.rejected,
                (state, action) => {

                    state.removing = false;
                    state.error = action.payload;

                }
            );

    },
});


export const {
    clearFavorites,
} = favoriteSlice.actions;


export default favoriteSlice.reducer;