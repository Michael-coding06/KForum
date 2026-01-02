import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useUpdateCommment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commentUpdate = async(commentID: number, newComment: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.put(`/comment/update/${commentID}`, {
                comment: newComment
            });
            return (res.data.comment);
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

    return {commentUpdate, error, loading}
}

export default useUpdateCommment;