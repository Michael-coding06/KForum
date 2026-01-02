import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useLikePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const likePost = async(postTitle: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/post/like", {
                postTitle: postTitle,
            });
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

    return {likePost, error, loading}
}

export default useLikePost;