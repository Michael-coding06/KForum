import axios from "axios";

const api = axios.create({
    // baseURL: "/",   // For testing purpose, will change to instance's url in final submissiion
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
})


export default api;