import {Outlet, Navigate} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api.tsx";

const ProtectedRoutes = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [authenticated, setAuthenticated] = useState<boolean>(true)
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        api.get("/auth/me")
        .then(res => {
            setUsername(res.data.username)
        })
        .catch(() => {
            setAuthenticated(false)
        })
        .finally(() => {
            setLoading(false)
        })
    }, [])
    
    if (loading) return <p> Checking authentication...</p>
    return authenticated ? <Outlet context={{username}}/> : <Navigate to = "/auth"/>
}

export default ProtectedRoutes;