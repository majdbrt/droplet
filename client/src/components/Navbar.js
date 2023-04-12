import React, { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import NavbarButton from "./NavbarButton";

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false);

    function handleClick() {
        toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
    }

    return (
        <>
            <div className=" flex bg-neutral-900  border-cyan-400 border-b-2 m-0 px-11 py-4 place-content-between">
                <h1 className="font-bold self-center text-2xl text-white">
                    <span className="text-cyan-400">drop</span>let

                </h1>

                <div onClick={handleClick} className="relative  z-20 md:hidden px-5 py-3 mx-2 text-2xl  text-slate-400 scale-100 hover:text-cyan-400 hover:font-medium duration-200 hover:scale-110">☰</div>

                <div className="hidden md:block ">
                    <div className=" flex">
                        <NavbarButton type="button" onClick={null} text="Sign up"/>
                        <PrimaryButton type="button" text="Log in" onClick={null} />
                    </div>
                </div>
            </div>

            <div className={`absolute md:hidden top-0 z-10 right-0 bg-neutral-900 md: ${!toggleMenu ? 'hidden' : ''} w-1/3 border-b-2 border-cyan-400 h-full`}>

                <div className="block my-40 text-3xl">
                    <div className=" my-14  text-slate-400 hover:text-4xl hover:text-white hover:font-medium duration-150 ">
                        <a className="">Sign up</a>
                    </div>
                    <div className=" my-14 text-3xl text-slate-400 hover:text-4xl hover:text-white hover:font-medium duration-150 ">
                        <a className="">Log in</a>
                    </div>
                </div>

            </div>

        </>

    );
}


export default Navbar;

