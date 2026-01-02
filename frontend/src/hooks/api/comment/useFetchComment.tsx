import { useState, useCallback } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";
import {Comment} from "../../../types/Comment.tsx"

const useFetchComments = () => {
    const [comments, setComments] = useState<Comment[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async(postID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<Comment[]>(`/comment/fetch/${postID}`);
            setComments(res.data)
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

    return {comments, fetchComments, loading, error}
}

export default useFetchComments;