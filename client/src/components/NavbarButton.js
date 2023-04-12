import React from "react";

function NavbarButton(props) {
    return (
        <div className=" font-medium text-xl scale-90 text-slate-400 hover:scale-95 hover:text-white  duration-150 ">
            <button type={props.type} onClick={props.onClick} className="cursor-default px-5 py-3 mx-2">{props.text}</button>
        </div>
    );
}

export default NavbarButton;