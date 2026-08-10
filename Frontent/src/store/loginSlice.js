import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";


// ========================================
// LOGOUT USER
// ========================================

export const logoutUser = createAsyncThunk(
    "login/logoutUser",

    async (_, { rejectWithValue }) => {

        try {

            const response = await fetch(
                "http://localhost:3000/logout",
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.status
            ) {

                return rejectWithValue(
                    result.message ||
                    "Logout failed"
                );

            }

            return true;

        } catch (error) {

            console.log(error);

            return rejectWithValue(
                "Server Error"
            );

        }

    }
);


// ========================================
// VISIT STATE
// ========================================

export const visitState = createAsyncThunk(
    "login/visitState",

    async (
        stateId,
        { rejectWithValue }
    ) => {

        try {

            const response = await fetch(
                "http://localhost:3000/dashboard/states/visit-state",
                {
                    method: "POST",
                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        stateId
                    }),
                }
            );

            const result =
                await response.json();


            if (
                !response.ok ||
                !result.success
            ) {

                return rejectWithValue(
                    result.message ||
                    "Failed to visit state"
                );

            }


            return result.visitedStates;

        } catch (error) {

            console.log(error);

            return rejectWithValue(
                "Server Error"
            );

        }

    }
);


// ========================================
// FETCH CURRENT USER
// ========================================

export const fetchUser = createAsyncThunk(
    "login/fetchUser",

    async (
        _,
        { rejectWithValue }
    ) => {

        try {

            const response = await fetch(
                "http://localhost:3000/me",
                {
                    method: "GET",
                    credentials: "include",
                }
            );


            if (response.status === 401) {

                return rejectWithValue({
                    message: "Unauthorized",
                    status: 401,
                });

            }


            const result =
                await response.json();


            if (
                !response.ok ||
                !result.status
            ) {

                return rejectWithValue({

                    message:
                        result.message ||
                        "Failed to fetch user",

                    status:
                        response.status,

                });

            }


            return result.user;

        } catch (error) {

            console.log(error);

            return rejectWithValue({
                message: "Server Error",
            });

        }

    }
);


// ========================================
// LOGIN SLICE
// ========================================

const loginSlice = createSlice({

    name: "login",


    initialState: {

        isLogin: false,

        user: null,

    },


    reducers: {


        // ========================================
        // LOGIN SUCCESS
        // ========================================

        loginSuccess: (
            state,
            action
        ) => {

            state.isLogin = true;

            state.user =
                action.payload;

        },


        // ========================================
        // UPDATE USER
        // ========================================

        updateUser: (
            state,
            action
        ) => {

            if (state.user) {

                state.user = {
                    ...state.user,
                    ...action.payload,
                };

            }

        },


        // ========================================
        // LOGOUT
        // ========================================

        logout: (state) => {

            state.isLogin = false;

            state.user = null;

        },

    },


    // ========================================
    // ASYNC ACTIONS
    // ========================================

    extraReducers: (builder) => {

        builder


            // ========================================
            // FETCH USER SUCCESS
            // ========================================

            .addCase(
                fetchUser.fulfilled,
                (state, action) => {

                    state.isLogin = true;

                    state.user =
                        action.payload;

                }
            )


            // ========================================
            // FETCH USER FAILED
            // ========================================

            .addCase(
                fetchUser.rejected,
                (state) => {

                    state.isLogin = false;

                    state.user = null;

                }
            )


            // ========================================
            // VISIT STATE
            // ========================================

            .addCase(
                visitState.fulfilled,
                (state, action) => {

                    if (state.user) {

                        state.user.visitedStates =
                            action.payload;

                    }

                }
            )


            // ========================================
            // LOGOUT SUCCESS
            // ========================================

            .addCase(
                logoutUser.fulfilled,
                (state) => {

                    state.isLogin = false;

                    state.user = null;

                }
            );

    },

});


export const {
    loginSuccess,
    updateUser,
    logout,
} = loginSlice.actions;


export default loginSlice.reducer;