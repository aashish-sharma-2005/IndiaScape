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

            // =========================================
            // IMPORTANT
            //
            // Add unique query parameter.
            //
            // This prevents browser/server from
            // returning 304 Not Modified.
            // =========================================

            const response = await fetch(
                `http://localhost:3000/me?_=${Date.now()}`,
                {
                    method: "GET",
                    credentials: "include",

                    cache: "no-store",

                    headers: {
                        "Cache-Control":
                            "no-cache",
                        "Pragma":
                            "no-cache",
                    },
                }
            );

            // ========================================
            // AUTH FAILURE
            // ========================================

            if (response.status === 401) {

                return rejectWithValue({
                    message:
                        "Unauthorized",
                    status: 401,
                });

            }

            // ========================================
            // BLOCKED / FORBIDDEN
            // ========================================

            if (response.status === 403) {

                return rejectWithValue({
                    message:
                        "Access denied",
                    status: 403,
                });

            }

            // ========================================
            // OTHER ERROR
            // ========================================

            if (!response.ok) {

                return rejectWithValue({
                    message:
                        `Request failed with status ${response.status}`,
                    status:
                        response.status,
                });

            }

            // ========================================
            // READ JSON
            // ========================================

            const result =
                await response.json();

            // ========================================
            // CHECK RESPONSE
            // ========================================

            if (!result.status) {

                return rejectWithValue({
                    message:
                        result.message ||
                        "Failed to fetch user",

                    status:
                        response.status,
                });

            }

            // ========================================
            // SUCCESS
            // ========================================

            return result.user;

        } catch (error) {

            console.log(
                "fetchUser error:",
                error
            );

            return rejectWithValue({
                message:
                    "Server Error",
                status: 500,
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

        fetchUserRequestId: null,

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

            state.fetchUserRequestId =
                null;

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

            state.fetchUserRequestId =
                null;

        },

    },

    // ========================================
    // ASYNC ACTIONS
    // ========================================

    extraReducers: (builder) => {

        builder

            // ========================================
            // FETCH USER STARTED
            // ========================================

            .addCase(
                fetchUser.pending,
                (state, action) => {

                    state.fetchUserRequestId =
                        action.meta.requestId;

                }
            )

            // ========================================
            // FETCH USER SUCCESS
            // ========================================

            .addCase(
                fetchUser.fulfilled,
                (state, action) => {

                    if (
                        state.fetchUserRequestId !==
                        action.meta.requestId
                    ) {

                        return;
                    }

                    state.isLogin = true;

                    state.user =
                        action.payload;

                    state.fetchUserRequestId =
                        null;

                }
            )

            // ========================================
            // FETCH USER FAILED
            // ========================================

            .addCase(
                fetchUser.rejected,
                (state, action) => {

                    if (
                        state.fetchUserRequestId !==
                        action.meta.requestId
                    ) {

                        return;
                    }

                    state.fetchUserRequestId =
                        null;

                    const status =
                        action.payload?.status;

                    // ========================================
                    // REAL AUTH FAILURE
                    // ========================================

                    if (
                        status === 401 ||
                        status === 403
                    ) {

                        state.isLogin = false;

                        state.user = null;

                    }

                    // ========================================
                    // SERVER / NETWORK / CACHE ERROR
                    //
                    // DON'T LOG USER OUT
                    // ========================================

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

                    state.fetchUserRequestId =
                        null;

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