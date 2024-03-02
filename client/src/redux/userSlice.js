import { createSlice } from "@reduxjs/toolkit"
const initialState = {
    currentUser : null,
    error : null,
    loading : false
}

const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers : {
        LoginStart : (state) => {
            state.loading = true;
            state.error = null;
        },
        LoginSuccess : (state,action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.loading = null;
        },
        LoginFailure : (state,action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
})

export const { LoginStart , LoginSuccess,LoginFailure } = userSlice.actions
export default userSlice.reducer