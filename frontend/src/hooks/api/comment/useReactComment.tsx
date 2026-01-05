import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useReactComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const reactComment = async(commentID: number, typeReact: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post(`/comment/react/${commentID}`, {
                reaction: typeReact
            });
            console.log(res.data.NoReactions)
            return(res.data.NoReactions)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "React failed")
            } else {
                alert("React failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {reactComment, error, loading}
}

export default useReactComment;