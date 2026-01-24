import axios from "axios";
console.log("Backend URL is:", process.env.REACT_APP_BACKEND_URL);
const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true, // to include cookies when sending request
})


export default api;