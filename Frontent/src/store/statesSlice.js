import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


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
        // REAL-TIME STATE UPDATE
        // =========================================

        updateState: (state, action) => {

            const updatedState = action.payload;

            const index = state.states.findIndex(
                (item) =>
                    item._id === updatedState._id
            );


            if (index !== -1) {

                state.states[index] =
                    updatedState;

            }

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
    updateState
} = statesSlice.actions;


export default statesSlice.reducer;