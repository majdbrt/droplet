import React from "react";

function PrimaryButton(props){
    return(
        <div className="bg-cyan-400 font-medium text-xl scale-90 hover:text-white duration-150  hover:scale-95 text-white rounded-full ">
        <button className="cursor-default px-5 py-3 mx-2" type={props.type} onClick={props.onClick}>{props.text}</button>
    </div> 
    );
}

export default PrimaryButton;