import { useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../../../api/api.tsx";
import {AuthResponse} from "../../../types/Auth";
import axios from "axios";


const useLogIn = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async(username: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post<AuthResponse>("/auth/login", {
                name: username,
                password: password,
            });
            console.log(res.data.message);
            navigate("/", {replace: true});  // redirect users to /KForum (Main page) 
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Log in failed");
            } else {
                alert("Log in failed. Please log in again");
            }
        } finally {
            setLoading(false)
        }
    }

    return {login, loading, error};
}

export default useLogIn;

