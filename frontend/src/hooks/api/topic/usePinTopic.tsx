import { useState } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";

const usePinTopic = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const topicPin = async(title: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.post("/topic/pin", {
                title: title,
            });
            
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Pin failed")
            } else {
                alert("Pin failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {topicPin, error, loading}
}

export default usePinTopic;