import React, { useEffect, useState, useRef } from "react";
import ChatOverview from "./ChatOverview";
import { useSelector, useDispatch } from "react-redux";
import { setRefresh, setGroups, setSelectedChat } from "../store/store";
import addImg from "../images/add.png";
import gearSelectedIcon from "../images/gear-selected-icon.png";
import gearIcon from "../images/gear-icon.png";
import SettingsPane from "./SettingsPane";
import { socket } from "../api/socket";
import Error from "./Error";

function ChatPane() {
    const { darkTheme, selectedChat, refresh, groups } = useSelector((state) => state.user);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [addContact, setAddContact] = useState("");
    const [error, setError] = useState({
        status: false,
        text: ""
    });

    const dispatch = useDispatch();

    function handleClick() {
        toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
    }// handleClick

    function handleChange(event) {
        setAddContact(event.target.value);
    }// handleChange

    function handleSubmit(event) {
        event.preventDefault();

        socket.emit("addGroup", {
            userID: localStorage.getItem("userID"),
            contactEmail: addContact
        });

    }// handleSubmit

    useEffect(() => {

        socket.on("refreshChatPane", (groups) => {

            dispatch(setGroups(groups));
            const windowSize = {
                width: window.innerWidth,
                hight: window.innerHeight
            };
            if (refresh === 0 && windowSize.width > 768) {
                dispatch(setSelectedChat(groups[0]));
                dispatch(setRefresh());
            }// if
            setAddContact("");
        });

        socket.on("exception", (error) => {
            setError({
                status: true,
                text: error.message
            });

            setTimeout(() => {
                setError({
                    status: false,
                    text: ""
                });
            }, 2000);
        });

        return () => {
            socket.off("refreshChatPane");
            socket.off("exception");
        }
    }, [/*refresh*/]);

    return (

        <aside className={` sticky overflow-y-hidden h-screen flex flex-col min-w-full  md:min-w-fit ${darkTheme ? 'bg-neutral-900' : 'bg-white '}  ${selectedChat ? 'hidden md:block' : ''} `}>
            <div ref={header} className="md:max-h-[20%]">
                <div  className={`${selectedChat ? 'hidden md:flex' : ''} flex sticky top-0 z-50 bg-neutral-900 border-cyan-400 w-full border-b-2 py-5 px-5 md:px-11 md:py-4 place-content-between`}>
                    <h1 className="font-bold self-center text-2xl md:text-2xl text-white">
                        <span className="text-cyan-400">drop</span>let
                    </h1>

                    <div onClick={handleClick} className="flex z-20 items-center md:hidden">
                        <img src={gearIcon} alt="" className={`m-0 p-0 w-6 h-auto ${toggleMenu ? 'hidden' : ''}`} />
                        <img src={gearSelectedIcon} alt="" className={` m-0 p-0 w-6 h-auto ${toggleMenu ? '' : 'hidden'}`} />
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={`sticky flex flex-row mx-2 my-3 h-12 border-2 border-neutral-500 focus:border-cyan-400 hover:border-cyan-400 ${darkTheme ? 'bg-neutral-900 text-white focus:bg-neutral-700 hover:bg-neutral-800' : 'bg-white hover:bg-neutral-50 focus:bg-neutral-50'}`}>

                        <input type="text" onChange={handleChange} className={`flex-1 border-0 pl-3 bg-transparent outline-none focus:border-0 appearance-none placeholder:text-neutral-500 `} value={addContact} placeholder="Add a contact" />
                        <button type="submit">
                            <img src={addImg} alt="" className={`h-8 w-8 flex-1  my-auto`} />
                        </button>

                    </div>
                </form>
            </div>

            <div className={` flex-1 h-[80%] overflow-y-auto`}>
                {
                    groups.map((group) => {
                        return <ChatOverview key={group._id} group={group} />
                    })
                }

            </div>

            <div className={`${!toggleMenu ? 'hidden' : ''}`}>
                <SettingsPane />
            </div>
            <div className={`absolute w-[90%] h-18 left-0 bottom-2 duration-500 ${!error.status ? '-translate-x-full' : ''}`}>
                <Error text={error.text} />
            </div>
        </aside>
    );
}


export default ChatPane;