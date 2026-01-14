import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useCreateTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topicCreate = async(title: string, description: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/topic/create", {
                title: title,
                description: description,
            });
            return (res.data.id);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Create failed")
            } else {
                alert("Create failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {topicCreate, error, loading}
}

export default useCreateTopic;