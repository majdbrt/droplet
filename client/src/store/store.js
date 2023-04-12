import { configureStore } from "@reduxjs/toolkit";
import { UserReducer, setTheme, setSelectedChat, addGroup, removeGroup, setRefresh, setGroups, setFocusedMessage } from "./slices/userSlice";

const store = configureStore({

    reducer: {
        user: UserReducer
    }
});

export { store };
export { setTheme, setSelectedChat, addGroup, removeGroup, setRefresh , setGroups, setFocusedMessage};