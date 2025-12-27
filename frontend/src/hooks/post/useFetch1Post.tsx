import { useState } from "react";
import api from "../../api/api.tsx";
import axios from "axios";
import {Post} from "../../types/Post.tsx"

const useFetch1Post = () => {
    const [postFetch, setPostFetch] = useState<Post>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetch1Post = async(postTitle: string) => {
        setLoading(true);
        setError(null);

        try {
            const res = await api.get<Post>(`/post/fetch1/${postTitle}`);
            setPostFetch(res.data)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.error ?? "Fetch data failed")
            } else {
                alert("Fetch data failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return {postFetch, fetch1Post, loading, error}
}

export default useFetch1Post;