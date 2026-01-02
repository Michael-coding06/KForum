import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useCreatePost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const postCreate = async(title: string, details: string, topic: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/post/create", {
                title: title,
                details: details,
                topic: topic
            });
            // console.log(res.data)
            return (res.data.post);
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