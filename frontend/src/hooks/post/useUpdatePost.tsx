import { useState } from "react";
import api from "../../api/api.tsx";
import axios from "axios";

const useUpdatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postUpdate = async(id: number, newTitle: string, newDetails: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.put(`/post/update/${id}`, {
                title: newTitle,
                details: newDetails,
            });
            return (res.data.post);
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

    return {postUpdate, error, loading}
}

export default useUpdatePost;