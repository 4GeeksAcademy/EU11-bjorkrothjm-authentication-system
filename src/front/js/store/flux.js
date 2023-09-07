const backend_url = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			userId: "",
			apiResponseMessage: "",
			userDataLoggedIn: {user_details: {}}
		},
		actions: {
			// Use getActions to call a function within a fuction

			apiFetch: async (endpoint, fetch_method, request_body = {}, fetch_headers = { "Content-Type": "application/json" }) => {

				try {
					console.log(request_body)
					console.log(fetch_headers)
					const response = await fetch(backend_url + "/api" + endpoint, fetch_method == "GET" ? { headers: fetch_headers } : {
						method: fetch_method,
						body: JSON.stringify(request_body), // convert data to a string to send it over HTTP
						headers: fetch_headers
					})
					const jsonData = await response.json();
					if (!response.ok) {
						console.log(response.ok, response.status)
						return { "response_code": response.status, "message": jsonData.message }
					} else {
						console.log("jsonData: ", jsonData)
						return { "response_code": response.status, "jsonData": jsonData, "message": jsonData.message }
					}

				} catch (error) {
					console.log(error);
				}
			},

			registerUser: async (formData) => {
				console.log("Sending formData", formData)
				const response = await getActions().apiFetch("/sign-up", "POST", formData)
				console.log("Register User Response", response)
				const store = getStore()
				if (response["response_code"] == 400) {
					setStore({ ...store, apiResponseMessage: response["message"] });
				} else {
					setStore({ ...store, apiResponseMessage: "" });
				}
			},

			loginUser: async (formData) => {
				console.log("formData being sent")
				const response = await getActions().apiFetch("/login", "POST", formData)
				const store = getStore()
				// Return message in case login fails
				if (response["response_code"] != 200) {
					console.log("login response", response)
					setStore({ ...store, apiResponseMessage: response["message"] });
					console.log("Store after failed login", store)
					return { "loginSuccess": false, "message": response["message"] }
				} else {
					console.log("response", response)
					localStorage.setItem("token", response["jsonData"]["token"]);
					console.log("localStorage set with token")
					const localStorageToken = localStorage.getItem("token");
					console.log("localStorage set to: ", localStorageToken)

					setStore({
						...store,
						userId: response["jsonData"]["user_id"],
						apiResponseMessage: response["message"]
					})
					console.log("Store after login", store)
					return { "loginSuccess": true, "message": response["message"] }
				}
			},

			logoutUser: async () => {
				// Remove token from localStorage
				localStorage.removeItem("token");

				// Reset userId and apiResponseMessage in Store
				const store = getStore()
				setStore({ ...store, userId: "",  apiResponseMessage: ""});

				console.log("Store after logout", store)
				console.log("User Logged Out")
			},

			checkUserData: async () => {
				const token = localStorage.getItem("token");
				console.log("Getting user data")
				console.log(token)
				const response = await getActions().apiFetch("/private", "GET", {}, {"Authorization": "Bearer " + token });
				console.log("User data response: ", response)
				const store = getStore()
				if (response["response_code"] == 200) {
					setStore({ ...store, userId: response["jsonData"]["user_details"]["id"],
					 apiResponseMessage: response["jsonData"]["message"],
					 userDataLoggedIn: response["jsonData"]["user_details"]
					});
					return {"user_details": response["jsonData"]["user_details"], "response_code": response["response_code"]}
				} else {
					setStore({ ...store});
					return ({ "response_code": response["response_code"] })
				}
			},

		}
	};
};

export default getState;
