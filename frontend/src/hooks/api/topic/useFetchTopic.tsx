import { 
    useState,
    useCallback 
} from "react";
import api from "../../../api/api.tsx";
import axios from "axios";
import {Topic} from "../../../types/Forum.tsx"

const useFetchTopic = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // prevent duplicate fetch
    const fetchTopics = useCallback(async() => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<Topic[]>("/topic/fetch");
            setTopics(res.data)
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

    return {topics, fetchTopics, loading, error}
}

export default useFetchTopic;