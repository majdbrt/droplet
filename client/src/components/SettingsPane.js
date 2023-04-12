import React from "react";
import { useNavigate } from "react-router-dom";
import Toggle from "./Toggle";
import axios from "axios";
import Cookies from "universal-cookie";

function SettingsPane() {
    const navigate = useNavigate();

    const cookies = new Cookies();

    const api = axios.create({
        baseURL: process.env.REACT_APP_API_URL + "/auth",
        timeout: 1000,
        headers: {
            "content-type": "application/json",
        },
        withCredentials: true

    });

    function handleClick() {

        api.post("/logout")
            .then((response) => {
                cookies.remove("accessToken");
                localStorage.removeItem("email");
                localStorage.removeItem("userID");
                navigate("/login");
            }).catch((error)=>{
                console.log(error);
                cookies.remove("accessToken");
                localStorage.removeItem("email");
                localStorage.removeItem("userID");
            })

    } // handleClick

    return (
        <div className={`absolute w-full top-0 z-20 right-0 bg-neutral-900  md:w-1/3 md:border-b-2 border-cyan-400 h-full`}>

            <div className="block my-52 text-3xl">
                <div className=" my-14 text-slate-400 hover:text-4xl hover:text-white hover:font-medium duration-150 ">
                    <button onClick={handleClick} className="" >Log out</button>
                </div>

                <hr className="w-64 mx-auto border-neutral-500" />
                <div className="my-14">
                    <Toggle />
                </div>

            </div>
        </div>
    );
}

export default SettingsPane;