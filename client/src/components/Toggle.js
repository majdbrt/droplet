import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/store";
import moonIcon from "../images/moon-icon.png";

function Toggle() {

    const dispatch = useDispatch();


    const darkTheme = useSelector((state) => state.user.darkTheme);


    useEffect(() => {
        localStorage.setItem("dark-mode", darkTheme);
    }, [darkTheme])


    function handleClick() {
        
        if (localStorage.getItem("dark-mode") === "dark") {
            return dispatch(setTheme(""))

        }// if

        return dispatch(setTheme("dark"))
    }// handleClick

    return (
        <div className="relative flex flex-row justify-center items-start">
            <img src={moonIcon} className="w-5 h-auto mr-3" alt="dark mode icon" />
            <div onClick={handleClick} className={`flex z-10 w-10 h-5 ${darkTheme ? 'bg-cyan-700 justify-end' : 'bg-neutral-700 justify-start'} rounded-lg  `}>
                <div className={`rounded-full h-5 w-5 ${darkTheme ? 'bg-cyan-400' : 'bg-neutral-500'} `}>

                </div>
            </div>
        </div>
    );
}


export default Toggle;