import React, { useState } from "react";
import gearIcon from "../images/gear-icon.png";
import gearSelectedIcon from "../images/gear-selected-icon.png";
import Toggle from "./Toggle";
import {useSelector} from "react-redux";



function NavbarLoggedIn() {
    const [toggleMenu, setToggleMenu] = useState(false);

    const {selectedChat} = useSelector((state)=> state.user);

    function handleClick() {
        toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
    }

    return (
        <>
            <div className={`${selectedChat? 'hidden md:flex':''} flex sticky top-0 z-50 bg-neutral-900 border-cyan-400 w-full border-b-2 py-5 px-5 md:px-11 md:py-4 place-content-between`}>
                <h1 className="font-bold self-center text-2xl md:text-2xl text-white">
                    <span className="text-cyan-400">drop</span>let

                </h1>
                <div onClick={handleClick} className="flex z-20 items-center ">
                    <img src={gearIcon} className={`m-0 p-0 w-6 h-auto ${toggleMenu ? 'hidden' : ''}`} />
                    <img src={gearSelectedIcon} className={` m-0 p-0 w-6 h-auto ${toggleMenu ? '' : 'hidden'}`} />
                </div>

            </div>

            <div className={`absolute w-full top-0 z-20 right-0 bg-neutral-900 md: ${!toggleMenu ? 'hidden' : ''} md:w-1/3 md:border-b-2 border-cyan-400 h-full`}>

                <div className="block my-52 text-3xl">
                    <div className=" my-14 text-slate-400 hover:text-4xl hover:text-white hover:font-medium duration-150 ">
                        <a className="">Log out</a>
                    </div>

                    <hr className="w-64 mx-auto border-neutral-500" />
                    <div  className="my-14">
                        <Toggle  className={``} />
                    </div>

                </div>
            </div>
        </>
    );
}


export default NavbarLoggedIn;
