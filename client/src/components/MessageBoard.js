import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFocusedMessage, setSelectedChat } from "../store/store";
import sendImg from "../images/send.png";
import backImgBlack from "../images/back-black.png";
import backImgWhite from "../images/back-white.png";
import Message from "./Message";
import gearSelectedIcon from "../images/gear-selected-icon.png";
import gearIcon from "../images/gear-icon.png";
import SettingsPane from "./SettingsPane";
import { socket } from "../api/socket";
import { sortMessages } from "../utils/helper";



function MessageBoard() {

    const dispatch = useDispatch();
    const { darkTheme, selectedChat, focusedMessage } = useSelector((state) => state.user);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [sendMessageInput, setSendMessageInput] = useState("");
    const [messagesList, setMessagesList] = useState([]);
    const [messageBoardHeight, setMessageBoardHeight] = useState(0);

    const header = useRef(null);
    const contactHeader = useRef(null);
    const messageBox = useRef(null);

    function handleClick() {
        toggleMenu ? setToggleMenu(false) : setToggleMenu(true);
    }// handleClick

    function handleChange(event) {
        setSendMessageInput(event.target.value);
    }// handleChange

    function handleSubmit(event) {
        event.preventDefault();

        if (sendMessageInput) {
            socket.emit("sendMessage", {
                groupID: selectedChat?._id,
                createdByID: localStorage.getItem("userID"),
                body: sendMessageInput
            });
        }// if

        setSendMessageInput("");

    }// handleSubmit

    useEffect(() => {

        socket.emit("getMessages", {
            groupID: selectedChat?._id
        });

        socket.on("messages", async (messages) => {
            const sortedMessages = sortMessages(messages);

            setMessagesList([
                ...sortedMessages
            ]);
            dispatch(setFocusedMessage(sortedMessages.length - 1));

        });
        socket.on("message", (message) => {
            socket.emit("getMessages", {
                groupID: selectedChat?._id,
                number: messagesList.length
            });
        });

        socket.on("sendingMoreMessages", async (messages) => {
            const sortedMessages = sortMessages(messages);

            dispatch(setFocusedMessage(sortedMessages.length - 1));
            setMessagesList((prev) => [...sortedMessages, ...prev]);
        });

        return () => {
            socket.off("message");
            socket.off("messages");
            socket.off("sendingMoreMessages");
        }
    }, [selectedChat]);

    useEffect(() => {
        const headerHeight = header.current.clientHeight;
        const contactHeaderHeight = contactHeader.current.clientHeight;
        const messageBoxHeight = messageBox.current.clientHeight;

        setMessageBoardHeight(window.innerHeight - (headerHeight + contactHeaderHeight + messageBoxHeight));

    }, [header, contactHeader, messageBox])

    return (
        <div id="mBoard" className={` overflow-hidden h-screen ${!selectedChat ? 'hidden md:block' : ''} w-full flex flex-col `}>
            <div ref={header} className={`${selectedChat ? 'hidden md:flex' : ''} flex  bg-neutral-900 border-cyan-400 w-full border-b-2 py-5 px-5 md:px-11 md:py-5 place-content-between justify-end`}>

                <div onClick={handleClick} className="flex z-50 items-center ">
                    <img src={gearIcon} alt="" className={`m-0 p-0 w-6 h-auto ${toggleMenu ? 'hidden' : ''}`} />
                    <img src={gearSelectedIcon} alt="" className={` m-0 p-0 w-6 h-auto ${toggleMenu ? '' : 'hidden'}`} />
                </div>

            </div>
            <div ref={contactHeader} className={`sticky bg-cyan-400 ${!selectedChat ? 'invisible' : ''} `}>
                {darkTheme ? <img onClick={() => dispatch(setSelectedChat(null))} src={backImgWhite} alt="" className="absolute z-10 left-0 top-0  md:hidden h-7 px-3 my-4 " /> : <img onClick={() => dispatch(setSelectedChat(null))} src={backImgBlack} alt="" className="absolute z-10 left-0 top-0  md:hidden h-7 px-3 my-4 " />}
                <p className={`sticky  py-3 font-bold  text-2xl w-full ${darkTheme ? 'text-white' : 'text-black'}  `}>{selectedChat?.participents?.[0].firstName} {selectedChat?.participents?.[0].lastName}</p>
            </div>
            <div className={` sticky bottom-0 h-[${messageBoardHeight}px] flex-1 overflow-y-auto flex flex-col  ${darkTheme ? 'bg-neutral-900' : 'bg-white'}   ${!selectedChat ? 'invisible' : ''} `}>

                {messagesList.map((message, index) => {

                    return <Message id={
                        index === focusedMessage ? "last" : index === 0 ? "first" : null
                    } key={message._id} message={message} />
                })}

            </div>


            <form ref={messageBox} onSubmit={handleSubmit} className={`  m-0 w-full ${!selectedChat ? 'invisible' : ''} `}>
                <div id="" className={`flex h-12  border-t-2 border-neutral-500 focus:border-cyan-400 hover:border-cyan-400 ${darkTheme ? 'bg-neutral-900 text-white focus:bg-neutral-700 hover:bg-neutral-700 ' : 'bg-white text-black hover:bg-neutral-50 focus:bg-neutral-50'}`}>
                    <input type="text" className={`flex-1 border-0 pl-3 bg-transparent outline-none focus:border-0 appearance-none placeholder:text-neutral-500 `} placeholder="Send a message..." onChange={handleChange} value={sendMessageInput} />
                    <button type="submit">
                        <img src={sendImg} alt="" className={`h-8 my-auto px-2`} />
                    </button>

                </div>
            </form>
            <div className={`${!toggleMenu ? 'hidden' : ''}`}>
                <SettingsPane />
            </div>
        </div>
    );
}


export default MessageBoard;