
import errorIcon from "../images/error-icon.png";
import { useSelector } from "react-redux";

function Error(props){
    const darkTheme = useSelector((state) => state.user.darkTheme);
    return(
        <div className={`flex w-[90%] h-16 ${darkTheme? 'bg-neutral-700' : 'bg-neutral-100'} bg-neutral-700  text-rose-500 border-rose-500 border-2`}>
            <img className="w-8 h-8 my-auto mx-3 " src={errorIcon} alt=""/>
            <p className="my-auto ">{props.text}</p>
        </div>
    );
}

export default Error
