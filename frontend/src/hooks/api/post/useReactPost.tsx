import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useReactPost = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reactPost = async(postID: number, typeReact: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(`/post/react/${postID}`, {
                reaction: typeReact,
            });
            console.log(res.data.NoReactions)
            return(res.data.NoReactions)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "react failed")
            } else {
                alert("react failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {reactPost, error, loading}
}

export default useReactPost;