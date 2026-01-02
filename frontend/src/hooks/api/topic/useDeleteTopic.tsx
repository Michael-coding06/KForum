import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useDeleteTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topicDelete = async(id: number) => {
        console.log(id);
        setLoading(true);
        setError(null);

        try {
            const res = await api.delete(`/topic/delete/${id}`)
            // return (res.data.topic);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Delete failed")
            } else {
                alert("Delete failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {topicDelete, error, loading}
}

export default useDeleteTopic;