import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
    name: "socket",
    initialState: {
        onlineUsers: [],    // array of user IDs currently online
        typingUserId: null, // userId of whoever is currently typing to me
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setTypingUser: (state, action) => {
            state.typingUserId = action.payload; // userId | null
        },
    },
});

export const { setOnlineUsers, setTypingUser } = socketSlice.actions;
export default socketSlice.reducer;
