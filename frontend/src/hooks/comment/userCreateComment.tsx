import { useState } from "react";
import api from "../../api/api.tsx";
import axios from "axios";

const useCreateComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commentCreate = async(comment: string, postID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/comment/create", {
                comment: comment,
                postID: postID
            });
            return (res.data.comment);
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

    return {commentCreate, error, loading}
}

export default useCreateComment;