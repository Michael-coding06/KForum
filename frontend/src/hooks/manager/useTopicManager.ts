import {
    useEffect,
    useState,
    useCallback, 
    useMemo
} from 'react';

import { Post } from '../../types/Post.tsx';

import useCreatePost from '../api/post/useCreatePost.tsx';
import useFetchPost from '../api/post/useFetchPost.tsx';
import useReactPost from '../api/post/useReactPost.tsx';

export const useTopicManager = (topicID: number | undefined, username: string) => {
    const [localPosts, setLocalPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

    //-----CreateCard state-----
    const [createTitle, setCreateTitle] = useState<string>('');
    const [createDetails, setCreateDetails] = useState<string>('');

    //-----Post states and actions-----
    const {posts: serverPosts, fetchPosts} = useFetchPost();
    const {postCreate} = useCreatePost();
    const {reactPost} = useReactPost();

    useEffect(() => {
        if(topicID) {
            fetchPosts(topicID);
        }
    }, [topicID]);

    useEffect(() => {
        setLocalPosts(
            serverPosts
                ? serverPosts.map(post => ({
                    ID: post.ID,
                    Title: post.Title,
                    Details: post.Details,
                    NoLikes: post.NoLikes,
                    NoDislikes: post.NoDislikes,
                    NoComments: post.NoComments,
                    Edited: post.Edited,
                    EditedAt: post.EditedAt,
                    Liked: post.Liked,
                    Disliked: post.Disliked,
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
        if (!isFormValid || !topicID) return;

        const id = await postCreate(createTitle, createDetails, topicID);
        if (!id) return
        const newPost: Post = {
            ID: id,
            Title: createTitle,
            Details: createDetails,
            NoLikes: 0,
            NoDislikes:0,
            NoComments: 0,
            Edited: false,
            EditedAt: null,
            Liked: false,
            Disliked: false,
            CreatedBy: username,
        };

        setLocalPosts(prev => [newPost,...prev]);
        resetCreateForm();
        setCreateDialogOpen(false);
    };

    const handleToggleReact = async (postID: number, typeReact: number) => {
        const NoReactions = await reactPost(postID, typeReact);
        setLocalPosts(prev => 
            prev.map(p => 
                p.ID === postID
                ? {...p, 
                    NoLikes: NoReactions[1], 
                    NoDislikes: NoReactions[0], 
                    Disliked: (typeReact == 1) ? false : !p.Disliked, 
                    Liked: (typeReact == -1) ? false : !p.Liked
                }
                : p
            )
        )
    }

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
        // handleToggleLike,
        handleToggleReact
    }
}