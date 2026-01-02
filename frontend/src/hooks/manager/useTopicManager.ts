import {
    useEffect,
    useState,
    useCallback, 
    useMemo
} from 'react';

import { Post } from '../../types/Post.tsx';

import useCreatePost from '../api/post/useCreatePost.tsx';
import useFetchPost from '../api/post/useFetchPost.tsx';
import useLikePost from '../api/post/useLikePost.tsx';

export const useTopicManager = (topicTitle: string | undefined, username: string) => {
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

    //-----CreateCard state-----
    const [createTitle, setCreateTitle] = useState<string>('');
    const [createDetails, setCreateDetails] = useState<string>('');

    //-----Post states and actions-----

    const {posts: serverPosts, fetchPosts} = useFetchPost();
    const {postCreate} = useCreatePost();
    const {likePost} = useLikePost();

    useEffect(() => {
        if(topicTitle) {
            fetchPosts(topicTitle);
        }
    }, [topicTitle]);

    useEffect(() => {
        setLocalPosts(
            serverPosts
                ? serverPosts.map(post => ({
                    ID: post.ID,
                    Title: post.Title,
                    Details: post.Details,
                    NoLikes: post.NoLikes,
                    NoComments: post.NoComments,
                    Edited: post.Edited,
                    EditedAt: post.EditedAt,
                    Liked: post.Liked,
                    CreatedBy: post.CreatedBy,
                }))
                : []
        );
    }, [serverPosts]);

    //------Search Action-----

    const matchesSearch = useCallback(
        (post: Post) => {
            const term = searchTerm.toLowerCase();
            return (
                post.Title.toLowerCase().includes(term) ||
                post.Details.toLowerCase().includes(term)
            );
        }, [searchTerm]
    );

    const filteredPosts = useMemo(
        () => localPosts.filter(p => matchesSearch(p)),
        [localPosts, matchesSearch]
    );

    //-----Create Actions-----

    const isFormValid = createTitle.trim().length > 0;

    const resetCreateForm = () => {
        setCreateTitle('');
        setCreateDetails('');
    };

    const handleCreateDialogClose = () => {
        resetCreateForm();
        setCreateDialogOpen(false);
    };

    const handleCreateDialogOpen = () => {
        setCreateDialogOpen(true);
    };

    //-----CRUD Action------

    const handleCreate = async () => {
        if (!isFormValid || !topicTitle) return;

        await postCreate(createTitle, createDetails, topicTitle);
        const newPost: Post = {
            ID: -1,
            Title: createTitle,
            Details: createDetails,
            NoLikes: 0,
            NoComments: 0,
            Edited: false,
            EditedAt: null,
            Liked: false,
            CreatedBy: username,
        };

        setLocalPosts(prev => [newPost,...prev]);
        resetCreateForm();
        setCreateDialogOpen(false);
    };

    const handleToggleLike = async (postID: number) => {
        const post = localPosts.find(p => p.ID === postID);
        if (!post) return;

        const NoLikes = await likePost(post.Title);

        //push the post to top
        setLocalPosts(prev => 
            prev.map(p => 
                p.ID === postID 
                    ? {...p, NoLikes, Liked: !p.Liked}
                    : p
            )
        );
    };

    return {
        searchTerm,
        setSearchTerm,

        localPosts, 
        setLocalPosts,

        filteredPosts,

        createDialogOpen,
        setCreateDialogOpen,

        createTitle,
        setCreateTitle,
        createDetails,
        setCreateDetails,
        isFormValid,
        handleCreateDialogOpen,
        handleCreateDialogClose,

        handleCreate,
        handleToggleLike,

    }
}

