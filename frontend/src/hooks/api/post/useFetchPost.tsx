import { useState, useCallback } from "react";
import api from "../../../api/api.tsx";
import axios from "axios";
import {Post} from "../../../types/Post.tsx"

const useFetchPost = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async(topicTitle: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<Post[]>(`/post/fetch/${topicTitle}`);
            setPosts(res.data)
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

    return {posts, fetchPosts, loading, error}
}

export default useFetchPost;