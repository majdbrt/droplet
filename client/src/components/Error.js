
import errorIcon from "../images/error-icon.png";

function Error(props){

    return(
        <div className="flex w-[90%] h-16 bg-transparent  text-rose-500 border-rose-500 border-2">
            <img className="w-8 h-8 my-auto mx-3 " src={errorIcon} alt=""/>
            <p className="my-auto ">{props.text}</p>
        </div>
    );
}


export default Error