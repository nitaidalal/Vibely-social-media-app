import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postReducer from './postSlice';
import vibeReducer from './vibeSlice';
import storyReducer from './storySlice';
import themeReducer from './themeSlice';
import messageReducer from './messageSlice';
import socketReducer from './socketSlice';

export const store = configureStore({
    reducer:{
        user: userReducer,
        post: postReducer,
        vibe: vibeReducer,
        story: storyReducer,
        theme: themeReducer,
        message: messageReducer,
        socket: socketReducer,
    }
})