import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/signup.css";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";


export const Signup = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [modalStatus, setModalStatus] = useState(false)
    const handleClose = () => setModalStatus(false);
    const handleShow = () => setModalStatus(true);

    const updateData = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // prevents the page from reloading and emptying the form
        // Call the registration action from your store (actions.registerUser)

        await actions.registerUser(formData);
        // Display the modal if store contains apiResponseMessage from API
        if (store.apiResponseMessage != "") {
            console.log("API response message on js form", store.apiResponseMessage)
            setModalStatus(true)
            console.log(modalStatus)
        } else {
            console.log("User created > Redirect")
            navigate("/")
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
        <div className="container container-custom-sign-up">

            <h1 className="header-one">Sign Up</h1>

            <form onSubmit={(e) => handleSubmit(e)}>              
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" onChange={updateData} value={formData.email} placeholder="Enter email" className="form-control" id="email" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" onChange={updateData} value={formData.password} placeholder="Create password" className="form-control" id="password" required />
                </div>
                <div className="send-btn-container">
                    <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>Create user</button>
                </div>

            </form>
            {/* {messageModal(store.apiResponseMessage)} */}
            {bootstrapMessageModal()}
        </div>

    );

}