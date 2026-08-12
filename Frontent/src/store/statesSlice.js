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

            if (!newState?._id) {
                return;
            }

            const alreadyExists = state.states.some(
                (item) =>
                    item._id === newState._id
            );

            if (
                !alreadyExists &&
                newState.visible !== false
            ) {

                state.states.push(newState);

            }

        },


        // =========================================
        // STATE UPDATED
        // =========================================

        updateState: (state, action) => {

            const updatedState = action.payload;

            if (!updatedState?._id) {
                return;
            }

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


        // =========================================
        // REAL-TIME STATE VISIBILITY UPDATE
        // =========================================

        updateStateVisibility: (
            state,
            action
        ) => {

            const updatedState =
                action.payload;

            if (!updatedState?._id) {
                return;
            }

            const index =
                state.states.findIndex(
                    (item) =>
                        item._id ===
                        updatedState._id
                );

            // =====================================
            // STATE ALREADY EXISTS
            // =====================================

            if (index !== -1) {

                state.states[index] = {
                    ...state.states[index],
                    ...updatedState
                };

                return;

            }

            // =====================================
            // STATE DOES NOT EXIST
            // BUT ADMIN SHOWED IT
            // =====================================

            if (
                updatedState.visible === true
            ) {

                state.states.push(
                    updatedState
                );

            }

        },


        // =========================================
        // UPDATE STATE IMAGE FROM PLACE
        // =========================================

        updateStateImage: (
            state,
            action
        ) => {

            const updatedPlace =
                action.payload;

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


        // =========================================
        // PLACE UPDATED REALTIME
        // =========================================

        placeUpdatedRealtime: (
            state,
            action
        ) => {

            const updatedPlace =
                action.payload;

            if (!updatedPlace?._id) {
                return;
            }


            // =====================================
            // FIND EXISTING PLACE
            // =====================================

            const index =
                state.famous.findIndex(
                    (place) =>
                        place._id ===
                        updatedPlace._id
                );


            // =====================================
            // PLACE EXISTS
            // =====================================

            if (index !== -1) {

                const oldPlace =
                    state.famous[index];


                /*
                 * Sometimes backend socket data
                 * may contain state_id as an ObjectId
                 * string instead of populated object.
                 *
                 * Keep old populated state_id if
                 * updated socket data doesn't contain
                 * the populated state object.
                 */

                const oldStateId =
                    oldPlace?.state_id;

                const newStateId =
                    updatedPlace?.state_id;


                let finalPlace = {
                    ...oldPlace,
                    ...updatedPlace,
                };


                if (
                    newStateId &&
                    typeof newStateId === "string" &&
                    oldStateId &&
                    typeof oldStateId === "object"
                ) {

                    finalPlace = {
                        ...finalPlace,
                        state_id: oldStateId,
                    };

                }


                state.famous[index] =
                    finalPlace;

                return;

            }


            // =====================================
            // PLACE NOT FOUND
            // =====================================

            /*
             * This can happen when:
             *
             * - admin adds a place
             * - user opened app before place existed
             * - socket update reaches user
             *
             * Add it to famous list.
             */

            state.famous.push(
                updatedPlace
            );

        },


        // =========================================
        // PLACE DELETED REALTIME
        // =========================================

        deletePlaceRealtime: (
            state,
            action
        ) => {

            const placeId =
                action.payload?._id ||
                action.payload;

            state.famous =
                state.famous.filter(
                    (place) =>
                        place._id !== placeId
                );

        },

    },


    extraReducers: (builder) => {

        builder

            // =====================================
            // FETCH PENDING
            // =====================================

            .addCase(
                fetchStatesData.pending,
                (state) => {

                    state.loading = true;
                    state.error = "";

                }
            )


            // =====================================
            // FETCH SUCCESS
            // =====================================

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


            // =====================================
            // FETCH ERROR
            // =====================================

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
    placeUpdatedRealtime,
    deletePlaceRealtime,
} = statesSlice.actions;

export default statesSlice.reducer;