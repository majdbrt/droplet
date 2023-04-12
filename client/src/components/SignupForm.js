import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from 'validator';
import PrimaryButton from "./PrimaryButton";
import eyeIcon from "../images/eye-icon.png"
import { useSelector } from "react-redux";
import axios from "axios";
import Cookies from "universal-cookie";

function SignupForm() {
    const navigate = useNavigate();

    const cookies = new Cookies();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        showConfirmPassword: false
    })
    const [valid, setValid] = useState({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        confirmPassword: true
    })

    const darkTheme = useSelector((state) => state.user.darkTheme);
    const accessToken = localStorage.getItem("accessToken");
    const api = axios.create({
        baseURL: "https://droplet-39g3.onrender.com" + "/auth",
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        withCredentials: true

    });

    function validateName() {


        return setValid({
            ...valid,
            firstName: !validator.isAlpha(form.firstName, "en-US", { ignore: " " }) && form.firstName !== "" ? false : true,
            lastName: !validator.isAlpha(form.lastName, "en-US", { ignore: " " }) && form.lastName !== "" ? false : true
        });
    }// validateName

    function validateEmail() {
        if (!validator.isEmail(form.email) && form.email !== "") {
            return setValid({
                ...valid,
                email: false,
            });
        }// if

        return setValid({
            ...valid,
            email: true,
        });
    }// validateEmail

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
            });
        }// if

        return setValid({
            ...valid,
            password: true,
        });
    } // validatePassword

    function validateConfirmPassword() {
        if (form.password !== form.confirmPassword && form.confirmPassword) {
            return setValid({
                ...valid,
                confirmPassword: false
            });
        }// if
        return setValid({
            ...valid,
            confirmPassword: true
        });
    }

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
    }// handleShowPassword

    function handleShowConfirmPassword() {
        form.showConfirmPassword ?
            setForm({
                ...form,
                showConfirmPassword: false
            })
            : setForm({
                ...form,
                showConfirmPassword: true
            })
    }// handleShowConfirmPassword

    function handleSubmit(event) {
        event.preventDefault();

        if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
            setValid({
                firstName: !form.firstName ? false : true,
                lastName: !form.lastName ? false : true,
                email: !form.email ? false : true,
                password: !form.password ? false : true,
                confirmPassword: !form.confirmPassword ? false : true,
            });

        }
        else {
            api.post("/signup", {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password
            }).then((response) => {
                if (response.status === 200) {

                    cookies.set("accessToken", response.data.accessToken);

                    localStorage.setItem("email", form.email);
                    localStorage.setItem("userID", response.data.userID);

                    navigate("/");
                }// if
                // navigate("/home");
            }).catch((error) => {
                if (error.response) {
                    console.log(error);
                }
            });
        }

    }// handleSubmit

    return (
        <div className="flex-1 flex flex-col items-center mx-auto w-full " >

            <form className=" mx-auto py-14 px-2 md:p-20 md:pt-10 md:pb-7 pb-8 h-auto" onSubmit={handleSubmit} >
                <div className="flex flex-row md:w-96 w-80 justify-between mx-auto ">
                    <div className="relative md:m-10 my-10 mb-0 md:mb-0 mt-0 md:mt-0 md:mx-0 mx-0" >
                        <input autoComplete="off" id="firstName" name="firstName" type="text" onChange={handleChange} onBlur={validateName} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.firstName ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-36 md:w-44 md:m-0`} placeholder="" value={form.firstName} />

                        <label htmlFor="firstName" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.firstName ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.firstName ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>First Name</label>

                    </div>
                    <div className="relative md:m-10 my-10 mb-0 md:mb-0 mt-0 md:mt-0  md:mx-0 " >
                        <input autoComplete="off" id="lastName" name="lastName" type="text" onChange={handleChange} onBlur={validateName} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.lastName ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-36 md:w-44 `} placeholder="" value={form.lastName} />

                        <label htmlFor="lastName" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.lastName ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.lastName ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Last Name</label>

                    </div>
                </div>
                <p className={`${valid.lastName && valid.firstName ? 'invisible' : ''} flex flex-row md:w-96 w-80 justify-between mx-auto   text-rose-500 pt-2 text-left`}>Please enter a valid name</p>
                <div className="relative md:m-10  mb-0 md:mb-0 md:my-3 my-3" >
                    <input autoComplete="off" id="login-email" name="email" type="email" onChange={handleChange} onBlur={validateEmail} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.email ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-80 md:w-96`} placeholder="" value={form.email} />

                    <label htmlFor="login-email" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.email ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.email ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Email Address</label>
                    <p className={`${valid.email ? 'invisible' : ''} text-rose-500 pt-2 text-left`}>Please enter a valid email address</p>
                </div>

                <div className="relative md:m-10 md:my-3 my-3" >
                    <input autoComplete="off" id="login-password" name="password" type={`${form.showPassword ? 'text' : 'password'}`} onChange={handleChange} onBlur={validatePassword} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.password ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-80 md:w-96`} placeholder="" value={form.password} />
                    <img src={eyeIcon} alt="" onClick={handleShowPassword} className="scale-75 absolute right-3 top-5" />
                    <label htmlFor="login-passowrd" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.password ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.password ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Password</label>
                    <p className={`${valid.password ? 'invisible' : ''} text-rose-500 pt-2 text-left`}>Please enter a valid password</p>
                </div>

                <div className="relative md:m-10 md:my-3 my-3" >
                    <input autoComplete="off" id="login-confirmPassword" name="confirmPassword" type={`${form.showConfirmPassword ? 'text' : 'password'}`} onChange={handleChange} onBlur={validateConfirmPassword} className={`block px-3  ${darkTheme ? ' text-white bg-neutral-900 hover:bg-neutral-800 focus:bg-neutral-800 ' : 'text-dark  hover:bg-neutral-50 focus:bg-neutral-50'} focus:outline-none border-solid appearance-none peer/email py-4 rounded-lg focus:border-cyan-400 hover:border-cyan-400 outline-none ${valid.confirmPassword ? 'border-neutral-500' : 'border-rose-500'}  focus:outline border-2 w-80 md:w-96`} placeholder="" value={form.confirmPassword} />
                    <img src={eyeIcon} alt="" onClick={handleShowConfirmPassword} className="scale-75 absolute right-3 top-5" />
                    <label htmlFor="login-confirmPassword" className={`absolute filled ${darkTheme ? 'bg-neutral-900' : 'bg-white'}  ${form.confirmPassword ? '-translate-y-7 text-sm ' : 'text-lg'}  top-4 left-3 ${valid.confirmPassword ? 'text-neutral-500' : 'text-rose-500'} peer-focus/email:-translate-y-7 peer-hover/email:-translate-y-7 transform peer-focus/email:text-cyan-400 peer-hover/email:text-cyan-400 peer-focus/email:text-sm peer-hover/email:text-sm  z-10`}>Confirm Password</label>
                    <p className={`${valid.confirmPassword ? 'invisible' : ''} text-rose-500 pt-2 text-left`}>Password doesn't match</p>
                </div>
                <div className=" w-80 md:w-96 mx-auto text-[9px] md:text-[11px] ">
                    <p className={` mb-5 ${darkTheme ? 'text-white' : 'text-black'}   font-md `}>By clicking on sign-up, you agree to droplet's <span className="cursor-pointer underline text-cyan-400">Terms and Conditions of Use</span>.</p>
                    <p className={` mt-5 mb-7 md:mb-9 ${darkTheme ? 'text-white' : 'text-black'}  font-md `}>To learn more about how droplet collects, uses, shares and protects your personal data, please see droplet's <span className="cursor-pointer underline text-cyan-400">Privacy Policy</span>.</p>
                </div>

                <div className="flex justify-center">
                    <PrimaryButton type="submit" text="Sign up" className="" />
                </div>

            </form>
            <p className={` ${darkTheme ? 'text-white' : 'text-black'}  mt-0 mb-5 font-md text-md`}>Have an account? <span onClick={() => { navigate("/login") }} className="cursor-pointer underline text-cyan-400">Log in</span>.</p>

        </div>
    );

}


export default SignupForm;
