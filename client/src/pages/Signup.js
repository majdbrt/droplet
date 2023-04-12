import React, {useEffect} from "react";
import {  useNavigate } from "react-router-dom";
import NavbarSimple from "../components/NavbarSimple";
import SignupForm from "../components/SignupForm"
import api from "../api/api";

function Signup() {

    const navigate = useNavigate();
    useEffect(()=>{
        api.get("/users/" + localStorage.getItem("userID"))
        .then((response) => {
            if(response.status === 200){
                navigate("/");
            }// if 
    
        }).catch((error) => {
            console.log(error);
        });
      })

    return (
        <div className=" flex flex-col w-full h-full">
            <NavbarSimple />
            <SignupForm />
        </div>

    );
}

export default Signup;