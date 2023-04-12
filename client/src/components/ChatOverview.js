import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat, setRefresh } from "../store/store";
import menuIcon from "../images/menu-icon.png";
import closeIcon from "../images/close-icon.png";
import { socket } from "../api/socket";

function ChatOverview(props) {
    const dispatch = useDispatch();
    const { darkTheme, groups } = useSelector((state) => state.user);

    const [toggleEdit, setToggleEdit] = useState(false);
    const [closeToggled, setCloseToggled] = useState(false);

    const id = props.group._id;
    const toFName = props.group.participents[0].firstName;
    const toLName = props.group.participents[0].lastName;
    const message = props.group.messages?.[0]?.body ? props.group.messages?.[0].body : "";
    const createdBy = props.group.messages?.[0]?.createdBy ? props.group.messages?.[0].createdBy: "";
    const userID = localStorage.getItem("userID");

    function handleClick() {
        if (toggleEdit) {
            setToggleEdit(false);
            setCloseToggled(true);
            return;
        }// if
        dispatch(setSelectedChat(props.group));
    }// handleClick

    async function handleDelete() {
        await socket.emit("deleteGroup", id);
        const windowSize = {
            width: window.innerWidth,
            hight: window.innerHeight
        };
        if (windowSize.width > 768) {
            dispatch(setSelectedChat(groups?.[0]));
            dispatch(setRefresh());
        }// if

    }// handleDelete

    return (
        <div>
            <div className="flex">

                <div onClick={handleClick} className=" w-full overflow-hidden flex pl-4 py-4 flex-1  ">
                    <div className="rounded-full my-auto bg-cyan-400 flex  w-14 h-14 border-2 border-neutral-700">
                        <p className="m-auto text-black  font-bold text-2xl">{toFName.substring(0, 1) + toLName.substring(0, 1)}</p>

                    </div>
                    <div className={`flex flex-col w-3/4 flex-1  pl-5 pr-1 text-left my-auto `}>
                        <p className={`text-lg font-semibold ${darkTheme ? 'text-white' : 'text-neutral-900'} `}>{toFName} {toLName}</p>

                        <div className="flex flex-row">
                            <p id="chatOverviewMessage" className={`text-neutral-500 font-medium whitespace-nowrap overflow-hidden   `}>{!createdBy? "" : createdBy === userID ? "You: " : toFName + ": "}{message}</p>

                        </div>

                    </div>
                </div>
                <div onClick={() => {
                    !closeToggled && toggleEdit ? setToggleEdit(false) : setToggleEdit(true);
                }} className={` w-[15%] flex  relative  overflow-hidden`}>

                    <img src={menuIcon} alt="" className={`w-6 h-6 m-auto`} />
                    <div onMouseEnter={() => setCloseToggled(true)} onMouseLeave={() => {
                        setToggleEdit(false);
                        setCloseToggled(true);
                    }} className={` flex bg-red-500 absolute -right-1 w-full h-full duration-500 ${!toggleEdit ? 'translate-x-full' : ''}`}>
                        <img src={closeIcon} alt="" onClick={handleDelete} className="w-5 h-5 m-auto hover:w-6 hover:h-6 duration-200" />
                    </div>
                </div>
            </div>
            <hr className="w-full border-neutral-500 bg-neutral-500 " />
        </div>

    );
}


export default ChatOverview;