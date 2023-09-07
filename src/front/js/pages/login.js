import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import "../../styles/login.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    // Use state to control Modal for displaying error message
    const [modalStatus, setModalStatus] = useState(false)
    const handleClose = () => setModalStatus(false);
    const handleShow = () => setModalStatus(true);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const updateData = (e) => {
        setFormData({
            ...formData,
            [e.target.id] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();  // prevents the page from reloading and emptying the form
        const response = await actions.loginUser(formData);
        console.log("TEST", response)
        if (response.loginSuccess == false){
            //alert(response.message)
            setModalStatus(true)
            console.log(modalStatus)
        } else {
            console.log(response.message)
            navigate("/private")
        }
    };

    const bootstrapMessageModal = (message=store.apiResponseMessage) => {
        return (
            <Modal show={modalStatus} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Ohh no...</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    return (
        <div className="container container-custom-login">
            <h1 className="centered-header">Login</h1>
            <div className="login-form">
                <form onSubmit={ (e) => handleSubmit(e)}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" onChange={updateData} value={formData.email} placeholder="Enter email" className="form-control" id="email" aria-describedby="emailHelp" required/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" onChange={updateData} value={formData.password} placeholder="Enter password" className="form-control" id="password" required/>
                    </div>
                    <div className="submit-button">
                        <button type="submit" className="btn btn-primary mb-3">Submit</button>
                    </div>
                </form>
                {bootstrapMessageModal()}
            </div>
        </div>
    );

}