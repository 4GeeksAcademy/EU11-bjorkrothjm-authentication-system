import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/navbar.css";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
    if (store.userId != ""){
		return (
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<div className="me-auto">
						<Link to="/">
							<button className="btn btn-primary">Home</button>
						</Link>
					</div>
					<div className="mx-2">
						<Link to="/signup">
							<button className="btn btn-primary">Signup</button>
						</Link>
					</div>
					<div className="mx-2">
						<Link to="/">
							<button className="btn btn-primary" onClick={() => actions.logoutUser()}>Logout</button>
						</Link>
					</div>
				</div>
			</nav>
		);

	
	}else {

		return (
			<nav className="navbar navbar-light bg-light">
				<div className="container">
					<div className="me-auto">
						<Link to="/">
							<button className="btn btn-primary">Home</button>
						</Link>
					</div>
					<div className="mx-2">
						<Link to="/signup">
							<button className="btn btn-primary">Signup</button>
						</Link>
					</div>
					<div className="mx-2">
						<Link to="/login">
							<button className="btn btn-primary">Login</button>
						</Link>
					</div>
				</div>
			</nav>
		);
	}
};
