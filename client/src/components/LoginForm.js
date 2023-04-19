import React, { useState } from "react";
import validator from 'validator';
import { useNavigate } from "react-router-dom"
import PrimaryButton from "./PrimaryButton";
import eyeIcon from "../images/eye-icon.png"
import { useSelector } from "react-redux";
import Cookies from "universal-cookie";
import axios from "axios";

function LoginForm() {
    const cookies = new Cookies();
    const navigate = useNavigate();

    const accessToken = cookies.get("accessToken");

    const [form, setForm] = useState({
        email: localStorage.getItem("rememberMe") || "",
        password: "",
        rememberMe: localStorage.getItem("rememberMe") ? true : false,
        showPassword: false
    })
    const [valid, setValid] = useState({
        email: true,
        password: true
    })

    const darkTheme = useSelector((state) => state.user.darkTheme);

    const api = axios.create({
        baseURL:process.env.REACT_APP_API_URL + "/auth",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        withCredentials: true

    });

    function validateEmail() {
        if (!validator.isEmail(form.email) && form.email !== "") {
            return setValid({
                ...valid,
                email: false,
            })
        }// if

        return setValid({
            ...valid,
            email: true,
        })
    } // validateEmail

    function validatePassword() {
        const passwordOptions = {
            minLength: 8,
            minLowercase: 0,
            minUppercase: 0,
            minSymbols: 0
        }

        if (!validator.isStrongPassword(form.password, passwordOptions) && form.password !== "") {
            return setValid({
                ...valid,
                password: false,
            })
        }// if

        return setValid({
            ...valid,
            password: true,
        })
    }// validatePassword

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }// handleChange

    function handleShowPassword() {
        form.showPassword ?
            setForm({
                ...form,
                showPassword: false
            })
            : setForm({
                ...form,
                showPassword: true
            })
    } // handleShowPassword

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.email || !form.password) {
            setValid({
                email: !form.email ? false : true,
                password: !form.password ? false : true,
            });

        }// if
        else {
            api.post("/login", {
                email: form.email,
                password: form.password
            }).then((response) => {
                if (response.status === 200) {
                    
                    cookies.set("accessToken", response.data.accessToken);

                    localStorage.setItem("email", form.email);
                    localStorage.setItem("userID", response.data.userID);

                    if (form.rememberMe) {
                        localStorage.setItem("rememberMe", form.email);
                    }// if

                    else {
                        localStorage.removeItem("rememberMe");
                    }// else
                     navigate("/");
                }// if
            }).catch((error) => console.log(error));

        }// else

    }// handleSubmit

    return (
        <div className=" flex flex-col my-auto items-center overflow-x-hidden  w-full  " >

            <form className="  w-[80%] md:w-fit pt-3 pb-10 px-3 md:p-20 md:pt-3 md:pb-12 rounded-lg h-auto" onSubmit={handleSubmit}>
                <div className="relative md:m-10  mb-0 md:mb-0 md:mt-5" >
                    <input autoComplete="off" id="login-email" name="email" type="email" onChange={handleChange} onBlur={validateEmail} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.email ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-full mx-auto md:w-96`} placeholder="" value={form.email} />

                    <label htmlFor="login-email" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.email ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.email ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Email address</label>
                    <p className={`${valid.email ? 'invisible' : ''} text-rose-500 pt-2 text-left`}>Please enter a valid email address</p>
                </div>

                <div className="relative md:m-10 md:my-3 my-3" >
                    <input autoComplete="off" id="login-password" name="password" type={`${form.showPassword ? 'text' : 'password'}`} onChange={handleChange} onBlur={validatePassword} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.password ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-full mx-auto md:w-96`} placeholder="" value={form.password} />
                    <img src={eyeIcon} alt="" onClick={handleShowPassword} className="scale-75 absolute right-3 top-5" />
                    <label htmlFor="login-passowrd" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.password ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.password ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Password</label>
                    <p className={`${valid.password ? 'invisible' : ''} text-rose-500 pt-2 text-left`}>Please enter a valid password</p>
                </div>

                <div className="flex flex-row justify-between md:mx-8 ">
                    <div className="flex">
                        <input type="checkbox" id="rememberMe" checked={form.rememberMe} onChange={(e) => {
                            setForm({
                                ...form,
                                rememberMe: e.target.checked
                            });
                        }} className="mr-2 ml-3 my-auto accent-cyan-400" />
                        <label htmlFor="rememberMe" className={`${darkTheme ? 'text-white' : 'text-black'} self-center`}>Remember me</label>
                    </div>

                    <PrimaryButton type="submit" text="Log in" className="" />

                </div>

            </form>

            <hr className=" border-neutral-500 w-[80%] md:w-96 "></hr>
            <p className={` ${darkTheme ? 'text-white' : 'text-black'}  mt-10 mb-7 font-md text-xl`}>Don't have an account?</p>

            <div className={`w-[80%] md:w-fit mb-10 ${darkTheme ? 'bg-neutral-900 hover:border-white' : 'bg-white  hover:border-black'} font-medium text-xl text-neutral-400 scale-90   hover:scale-95 border-2 border-neutral-500  rounded-full`}>
                <button className="cursor-default px-14  md:px-28 py-3 md:mx-2" type="button" onClick={()=>navigate("/signup")}>Sign up for droplet</button>
            </div>
        </div>
    );
}


export default LoginForm;
