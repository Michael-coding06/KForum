import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useCreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postCreate = async(title: string, details: string, topicID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/post/create", {
                title: title,
                details: details,
                topicID: topicID
            });
            console.log(res.data.id)
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

    return {postCreate, error, loading}
}

export default useCreatePost;