import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const usePinCommnet = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pinComment = async(commentID: number) => {
        setLoading(true);
        setError(null);

        try {
            await api.post(`/comment/pin/${commentID}`);
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

    return {pinComment, error, loading}
}

export default usePinCommnet;