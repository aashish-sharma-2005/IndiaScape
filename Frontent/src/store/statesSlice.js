import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


// =========================================
// FETCH STATES DATA
// =========================================

export const fetchStatesData = createAsyncThunk(
    "states/fetchStatesData",

    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                "http://localhost:3000/dashboard/states",
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            const result = await response.json();


            if (response.status === 401) {

                return rejectWithValue({
                    message: "Unauthorized",
                    status: 401,
                });

            }


            if (!response.ok || !result.status) {

                return rejectWithValue({
                    message:
                        result.message ||
                        "Something went wrong",

                    status: response.status,
                });

            }


            return {
                famous: result.places || [],
                states: result.states || [],
            };


        } catch (error) {

            console.log(error);

            return rejectWithValue({
                message: "Server Error",
            });

        }

    }
);


const statesSlice = createSlice({

    name: "states",

    initialState: {

        famous: [],
        states: [],
        loading: false,
        error: "",

    },


    reducers: {


        // =========================================
        // STATE ADDED
        // =========================================

        addStateRealtime: (state, action) => {

            const newState = action.payload;

            const alreadyExists = state.states.some(
                (item) => item._id === newState._id
            );


            if (!alreadyExists && newState.visible !== false) {

                state.states.push(newState);

            }

        },


        // =========================================
        // STATE UPDATED
        // =========================================

        updateState: (state, action) => {

            const updatedState = action.payload;

            const index = state.states.findIndex(
                (item) =>
                    item._id === updatedState._id
            );


            if (index !== -1) {

                state.states[index] = {
                    ...state.states[index],
                    ...updatedState,
                };

            }

        },


        // =========================================
        // STATE DELETED
        // =========================================

        deleteStateRealtime: (state, action) => {

            const deletedStateId =
                action.payload?._id ||
                action.payload;


            state.states =
                state.states.filter(
                    (item) =>
                        item._id !== deletedStateId
                );


            // Also remove places belonging
            // to the deleted state

            state.famous =
                state.famous.filter(
                    (place) => {

                        const placeStateId =
                            place.state_id?._id ||
                            place.state_id;

                        return (
                            placeStateId !==
                            deletedStateId
                        );

                    }
                );

        },

        // REAL-TIME STATE VISIBILITY UPDATE
        // =========================================

        updateStateVisibility: (state, action) => {

            const updatedState = action.payload;

            const index = state.states.findIndex(
                (item) => item._id === updatedState._id
            );


            // =========================================
            // STATE ALREADY EXISTS
            // =========================================

            if (index !== -1) {

                state.states[index] = {
                    ...state.states[index],
                    ...updatedState
                };

                return;
            }


            // =========================================
            // STATE DOES NOT EXIST
            // BUT ADMIN SHOWED IT
            // =========================================

            if (updatedState.visible === true) {

                state.states.push(updatedState);

            }

        },


        // =========================================
        // UPDATE STATE IMAGE FROM PLACE
        // =========================================

        updateStateImage: (state, action) => {

            const updatedPlace = action.payload;

            const stateId =
                updatedPlace?.state_id?._id ||
                updatedPlace?.state_id;


            if (!stateId) {
                return;
            }


            const stateIndex =
                state.states.findIndex(
                    (item) =>
                        item._id === stateId
                );


            if (stateIndex === -1) {
                return;
            }


            state.states[stateIndex].photos =
                updatedPlace.photos || [];

        },

    },


    extraReducers: (builder) => {

        builder


            // =========================================
            // FETCH PENDING
            // =========================================

            .addCase(
                fetchStatesData.pending,
                (state) => {

                    state.loading = true;
                    state.error = "";

                }
            )


            // =========================================
            // FETCH SUCCESS
            // =========================================

            .addCase(
                fetchStatesData.fulfilled,
                (state, action) => {

                    state.loading = false;

                    state.famous =
                        action.payload.famous;

                    state.states =
                        action.payload.states;

                }
            )


            // =========================================
            // FETCH ERROR
            // =========================================

            .addCase(
                fetchStatesData.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload?.message ||
                        "Something went wrong";

                }
            );

    },

});


export const {
    addStateRealtime,
    updateState,
    deleteStateRealtime,
    updateStateVisibility,
    updateStateImage,
} = statesSlice.actions;


export default statesSlice.reducer;