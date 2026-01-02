import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const useReplyComment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const commentReply = async(reply: string, commentID: number, postID: number) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post('/comment/reply', {
                reply: reply,
                commentID: commentID,
                postID: postID
            });
            return (res.data.reply);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Reply failed")
            } else {
                alert("Reply failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {commentReply, error, loading}
}

export default useReplyComment;