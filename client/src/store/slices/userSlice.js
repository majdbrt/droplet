import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    darkTheme: localStorage.getItem("dark-mode") === "dark" ? "dark" : "",
    selectedChat: null,
    focusedMessage: null,
    groups: [],
    refresh: 0
  },
  reducers: {
    setTheme(state, action) {
      state.darkTheme = action.payload;
    },
    setSelectedChat(state, action) {
      state.selectedChat = action.payload
    },
    setGroups(state, action){
      state.groups = action.payload;
    },
    addGroup(state, action) {
      state.groups.push(action.payload);
    },
    removeGroup(state, action) {
      const index = state.groups.map(group => group._id).indexOf(action.payload);
      if (index > -1) {
        state.groups.splice(index, 1);
      }
    },
    setFocusedMessage(state,action){
      state.focusedMessage = action.payload;
    },
    setRefresh(state,action){
      state.refresh += 1;
    }
  }
});

export const UserReducer = userSlice.reducer
export const { setTheme, setSelectedChat, addGroup, removeGroup, setRefresh, setGroups, setFocusedMessage} = userSlice.actions;