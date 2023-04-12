import React, {  useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import {socket} from "../api/socket";

function Message(props){
    const userID = localStorage.getItem("userID");
    const { darkTheme } = useSelector((state) => state.user)
    const {createdBy, createdAt, body} = props.message;

    const {ref} = useInView({
        triggerOnce: false,
        threshold:0,
        rootMargin:"-100px",
        onChange: (inView) => {
            if (inView) {
                socket.emit("getMoreMessages", props.message);
            }
          },
    });
    const lastNode = useRef(document.getElementById("last"));

    function formatTimestamp(){
        const date = new Date(createdAt);
        const today = new Date();
        if(date.toLocaleDateString() === today.toLocaleDateString()){
            return date.toLocaleTimeString();
        }
        return date.toLocaleDateString();
    }
     

  
   
    useEffect(()=>{
        const lastElem = document.getElementById("last");
        if(lastElem){
            lastNode.current = lastElem;
            lastNode.current.scrollIntoView();
        }
    }, []);

    return (
        <div ref={ props.id ==="first"? ref: props.id === "last"? lastNode: null
        } id={props.id} className={`flex ${createdBy === userID ? 'flex-row-reverse':'flex-row'} `}>
            <div className={` text-left max-w-[85%] md:max-w-[75%] px-5  my-2 py-2 ${createdBy === userID ? `${darkTheme ? 'text-white' : 'text-black'} rounded-l-lg  rounded-tr-lg ml-auto mr-1 bg-cyan-400 text-neutral-900` : `rounded-r-lg rounded-tl-lg mr-auto ml-1 ${darkTheme ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-black'}`}`}>
                <p className="">{body}</p>
            </div>
            <p className={`px-2 my-auto text-xs font-medium text-neutral-500  ${createdBy === userID ? 'mr-auto' : 'ml-auto'}`}>
                {formatTimestamp()}
            </p>
        </div>

    );
};


export default Message;