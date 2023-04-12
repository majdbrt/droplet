import React, {useEffect} from "react";
import {  useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import NavbarSimple from "../components/NavbarSimple";
import api from "../api/api";

function Login() {
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
        <div className="flex flex-col w-screen h-screen ">
            <NavbarSimple />
            <LoginForm />
        </div>
    );
}


export default Login;