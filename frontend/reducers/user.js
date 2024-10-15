import { createSlice } from '@reduxjs/toolkit';

const initialState = { username: "", likedRecipes: [], token: "" };

export const userSlice = createSlice({
  name: 'user',

  initialState,
  reducers: {
    updateUserRedux: (state, action) => {
      state.username = action.payload.username
      state.token = action.payload.token
      state.likedRecipes = action.payload.likedRecipes
    },
    updateLike: (state, action) => {
      state.likedRecipes = action.payload
    }
  },
});

export const { updateUserRedux, updateLike } = userSlice.actions;
export default userSlice.reducer;