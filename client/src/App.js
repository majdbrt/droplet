import React from 'react';
import './App.css';
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Chats from './pages/Chats';
import Login from './pages/Login';
import Signup from "./pages/Signup";

function App() {


  const darkTheme = useSelector((state) => state.user.darkTheme);


  return (

    <div className={`App  ${darkTheme === "dark" ? 'bg-neutral-900' : 'bg-white'} `}>
      <Routes>
        <Route path="/" element={<Chats />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </div>

  );
}

export default App;
