import { useState } from "react";
import api from "../../api/api.tsx";
import axios from "axios";

const useDeletePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postDelete = async(id: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.delete(`/post/delete/${id}`)
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

    return {postDelete, error, loading}
}

export default useDeletePost;