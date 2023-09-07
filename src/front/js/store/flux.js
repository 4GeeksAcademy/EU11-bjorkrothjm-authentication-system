const backend_url = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			userId: "",
			apiResponseMessage: "",

			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
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
				// const store = getStore()
				// if (response["response_code"] == 400) {
				// 	setStore({ ...store, apiResponseMessage: response["message"] });
				// } else {
				// 	setStore({ ...store, apiResponseMessage: "" });
				// }
			},

			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
