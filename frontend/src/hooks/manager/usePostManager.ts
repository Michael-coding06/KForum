import {
    useEffect,
    useState,
    useCallback
} from 'react';

import {Post} from '../../types/Post.tsx';
import {Comment, ReplyReturn} from '../../types/Comment.tsx';

import useFetch1Post from '../api/post/useFetch1Post.tsx';
// import useLikePost from '../api/post/useLikePost.tsx';
// import useDislikePost from '../api/post/useDislikePost.tsx';
// C:\Users\Admin\Desktop\Projects\CVWO\frontend\src\hooks\api\post\useReactPost.tsx
import useReactPost from '../api/post/useReactPost.tsx';
import useUpdatePost from '../api/post/useUpdatePost.tsx';

import useCreateComment from '../api/comment/userCreateComment.tsx';
import useFetchComments from '../api/comment/useFetchComment.tsx';
import useReactComment from '../api/comment/useReactComment.tsx';
import useReplyComment from '../api/comment/useReplyComment.tsx';
import useDeleteComment from '../api/comment/useDeleteComment.tsx';

export const usePostManager = (postID: number | undefined, username: string) => {
    const [localPost, setLocalPost] = useState<Post | null>(null);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [commentText, setCommentText] = useState<string>('');
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

    // -----Post states and actions-----
    const { postFetch, fetch1Post } = useFetch1Post();
    // const { likePost } = useLikePost();
    const { reactPost } = useReactPost();
    const { postUpdate } = useUpdatePost();

    // -----Comment states and actions-----
    const { comments, fetchComments } = useFetchComments();
    const { commentCreate } = useCreateComment();
    const { reactComment } = useReactComment();
    const { commentReply } = useReplyComment();
    const { commentDelete } = useDeleteComment();

    // -----Fetch post-----
    useEffect(() => {
        if (postID) {
            fetch1Post(postID);
        }
    }, [postID]);

    useEffect(() => {
        if (postFetch) {
            setLocalPost(postFetch)
        }
    }, [postFetch]);

    //-----Fetch comments-----
    useEffect(() => {
        if(localPost) {
            fetchComments(localPost.ID)
        }
    }, [localPost]);

    useEffect(() => {
        if (!comments) {
            setLocalComments([]);
            return;
        }

        setLocalComments(
            comments.map(comment => ({
                ID: comment.ID,
                Comment: comment.Comment,
                CreatedBy: comment.CreatedBy,
                CreatedAt: comment.CreatedAt,
                Edited: comment.Edited,
                EditedAt: comment.EditedAt,
                NoLikes: comment.NoLikes,
                NoDislikes: comment.NoDislikes,
                Disliked: comment.Disliked,
                Liked: comment.Liked,
                NoComments: comment.NoComments,
                IsPinned: comment.IsPinned,
                ParentComment: comment.ParentComment
            }))
        )
    }, [comments]);

    // -----Post ownership check-----
    const isPostOwner = localPost?.CreatedBy === username;

    // -----Edit Dialog Actions-----
    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    }

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    }

    //-----Post Actions-----
    const handleToggleReact = async (typeReact: number) => {
        if (localPost) {
            const NoReactions = await reactPost(localPost.ID, typeReact);
            const [NoDislikes, noLikes] = NoReactions;
            setLocalPost(prev => 
                prev 
                    ? {...prev, 
                    NoLikes: noLikes, 
                    NoDislikes: NoDislikes, 
                    Disliked: (typeReact == 1) ? false : !prev.Disliked, 
                    Liked: (typeReact == -1) ? false : !prev.Liked
                    }
                    : prev
            )
        }
    }

    const handleUpdate = async (newTitle: string, newDetails: string) => {
        if (localPost) {
            await postUpdate(localPost.ID, newTitle, newDetails);

            const newPost: Post = {
                ID: localPost.ID,
                Title: newTitle,
                Details: newDetails,
                NoLikes: localPost.NoLikes,
                NoDislikes: localPost.NoComments,
                Disliked: localPost.Disliked,
                NoComments: localPost.NoComments,
                Edited: true,
                EditedAt: new Date().toISOString(),
                Liked: localPost.Liked,
                CreatedBy: localPost.CreatedBy
            };
            setLocalPost(newPost);
            return newPost;
        }
        return null;
    };

    //-----Comment Actions-----
    const handleSubmitComment = async () => {
        if (!commentText.trim()) return;
        if (localPost) {
            await commentCreate(commentText, localPost.ID);
            
            setLocalPost(prev => 
                prev 
                    ? {...prev, NoComments: prev.NoComments + 1}
                    : prev
            )
        }
        setCommentText('');
    };

    const handleUpdateComment = (commentID: number, udpdateComment: string) => {
        setLocalComments(prev => 
            prev.map(comment => 
                comment.ID === commentID
                    ? {...comment, Comment: udpdateComment, Edited: true, EditedAt: new Date().toISOString()}
                    : comment
            )
        );
    };

    const handlePinComment = (commentID: number) => {
        setLocalComments(prev => {
            const pinned = prev.find(c => c.ID === commentID);
            if (!pinned) return prev;

            const others = prev.filter(c => c.ID !== commentID);

            return [
                { ...pinned, IsPinned: true },
                ...others
            ];
        });
    };

    const handleUnPinComment = (commentID: number) => {
        setLocalComments(prev => 
            prev.map(comment =>
                comment.ID === commentID
                    ? {...comment, IsPinned: false}
                    : comment
            )
        );
    };

    const handleDeleteComment = async (commentID: number) => {
        await commentDelete(commentID);

        setLocalComments(prev => prev.filter(comment => comment.ID !== commentID))
        setLocalPost(prev => 
            prev 
                ? {...prev, NoComments: Math.max(0, prev.NoComments -1)}
                : prev
        );
    };

    const handleToggleReactComment = async (commentID: number, typeReact: number) => {
        const NoReactions = await reactComment(commentID, typeReact);
        const [NoDislikes, noLikes] = NoReactions;
        setLocalComments(prev => 
            prev.map(c => 
                c.ID === commentID
                    ? {...c, 
                        NoLikes: noLikes,
                        NoDislikes: NoDislikes,
                        Liked: (typeReact == 1) ? !c.Liked : false, 
                        Disliked: (typeReact == -1) ? !c.Disliked : false,
                    }
                    : c
            )
        );
    }

    const handleReplyComment = async (commentID: number, reply: string): Promise<ReplyReturn> => {
        if (!postID) {
            throw new Error('Post ID is missing');
        };
        return await commentReply(reply, commentID, postID);
    }

    // -----Filter top-level comments (exclude replies)-----
    const topLevelComments = localComments.filter(comment => comment.ParentComment == null);
    return {
        // State
        localPost,
        localComments,
        topLevelComments,
        searchTerm,
        setSearchTerm,
        commentText,
        setCommentText,
        editDialogOpen,
        isPostOwner,

        // Post Actions
        // handleToggleLike,
        handleUpdate,
        handleEditDialogOpen,
        handleEditDialogClose,
        handleToggleReact,

        // Comment Actions
        handleSubmitComment,
        handleUpdateComment,
        handleDeleteComment,
        handleToggleReactComment,
        handleReplyComment,
        handlePinComment,
        handleUnPinComment
    }
};