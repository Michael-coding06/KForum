import { useState, useCallback } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";
import {Comment} from "../../../types/Comment.tsx"

const useFetchReply = () => {
    const [replies, setReplies] = useState<Comment[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReplies = useCallback(async(commentID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<Comment[]>(`/comment/reply/fetch/${commentID}`);
            setReplies(res.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Fetch data failed")
            } else {
                alert("Fetch data failed")
            }
        } finally {
            setLoading(false)
        }
    }, []);

    return {replies, fetchReplies, loading, error}
}

export default useFetchReply;