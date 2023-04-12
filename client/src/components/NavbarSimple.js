import React from "react";
import Toggle from "./Toggle";

function NavbarSimple() {


    return (
        
            <div className="sticky top-0 z-50 flex md:relative w-full items-center bg-neutral-900  border-cyan-400 border-b-2  py-5 px-5 md:px-11 md:py-6">

                <h1 className="font-bold md:mx-auto mr-auto  text-2xl text-white">
                    <span className="text-cyan-400">drop</span>let
                </h1>
                <div className="absolute top-8 right-4 ">
                    <Toggle />
                </div>


            </div>
    );
}

export default NavbarSimple;

