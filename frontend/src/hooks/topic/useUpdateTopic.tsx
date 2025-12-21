import { useState } from "react";
import api from "../../api/api.tsx";
import axios from "axios";

const useUpdateTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topicUpdate = async(id: number, newTitle: string, newDescription: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.put(`/topic/update/${id}`, {
                title: newTitle,
                description: newDescription,
            });
            return (res.data.topic);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Update failed")
            } else {
                alert("Update failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {topicUpdate, error, loading}
}

export default useUpdateTopic;