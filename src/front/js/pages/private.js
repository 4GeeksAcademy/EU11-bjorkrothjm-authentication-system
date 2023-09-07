import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/private.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";


export const Private = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    //const [userData, setUserData] = useState({});

    useEffect( () => {
        const userDataFunction = async () => {
            await actions.checkUserData()
        }
        userDataFunction()
    },[])

    // console.log("Logging userData outside function", userData)
    // console.log(typeof(userData))
    // console.log("Logging", userData["user_details"])
    // console.log(typeof(userData.user_details))
    // console.log("Logging", userData["user_details"]["email"])
    //console.log(userData["email"])
    // if (userData["response_code"] != 200) {
    console.log("Store in Private", store)
    if (store.userId == ""){
        navigate("/")
    }    
        
    return(
        <div className="container">
            <h1 className="centered-header">Private</h1>
            <p>
                Email: {store.userDataLoggedIn.email}
            </p>
        </div>
    )
}