import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useLikeComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const likeComment = async(commentID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(`/comment/like/${commentID}`);
            console.log(res.data)
            return(res.data.NoLikes)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Like failed")
            } else {
                alert("Like failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {likeComment, error, loading}
}

export default useLikeComment;