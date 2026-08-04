import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// ========================================
// VISIT STATE
// ========================================

export const visitState = createAsyncThunk(
    "login/visitState",

    async (stateId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                "http://localhost:3000/dashboard/states/visit-state",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ stateId }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                return rejectWithValue(
                    result.message || "Failed to visit state"
                );
            }

            // Backend se visitedStates aa raha hai
            return result.visitedStates;

        } catch (error) {
            console.log(error);

            return rejectWithValue("Server Error");
        }
    }
);


// ========================================
// FETCH CURRENT USER
// ========================================

export const fetchUser = createAsyncThunk(
    "login/fetchUser",

    async (_, { rejectWithValue }) => {
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

            const result = await response.json();

            if (!response.ok || !result.status) {
                return rejectWithValue({
                    message: result.message || "Failed to fetch user",
                    status: response.status,
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


const loginSlice = createSlice({
    name: "login",

    initialState: {
        isLogin: false,
        user: null
    },

    reducers: {

        loginSuccess: (state, action) => {
            state.isLogin = true;
            state.user = action.payload;
        },

        logout: (state) => {
            state.isLogin = false;
            state.user = null;
        }
    },

    extraReducers: (builder) => {

        builder

            // FETCH USER
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.isLogin = true;
                state.user = action.payload;
            })

            .addCase(fetchUser.rejected, (state) => {
                state.isLogin = false;
                state.user = null;
            })


            // VISIT STATE
            .addCase(visitState.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.visitedStates = action.payload;
                }
            })
    }
});


export const {
    loginSuccess,
    logout
} = loginSlice.actions;

export default loginSlice.reducer;