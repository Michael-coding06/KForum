import { useState } from "react";
import {useNavigate} from "react-router-dom";
import api from "../../../api/api.tsx";
import axios from "axios";
import {AuthResponse} from "../../../types/Auth.tsx";

const useSignUp = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); 

    const signup = async (username: string, password: string) => {
        console.log("this is the api: ", api.defaults.baseURL)
        setLoading(true);
        setError(null);
        try {
            const res = await api.post<AuthResponse>("/auth/signup", {
                name: username,
                password: password,
            });
            console.log(res.data.message);
            navigate("/", {replace: true})
            
        } catch (error) {
           if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Sign up failed");
            } else {
                alert("Sign up failed. Please sign up again");
            }
        } finally {
            setLoading(false);
        }
    }
    return {signup, loading, error};
}

export default useSignUp;

