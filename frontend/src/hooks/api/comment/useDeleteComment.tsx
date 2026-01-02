import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useDeleteComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commentDelete = async(commentID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.delete(`/comment/delete/${commentID}`)
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

    return {commentDelete, error, loading}
}

export default useDeleteComment;