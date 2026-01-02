import {
    useEffect,
    useState,
    useCallback
} from 'react';

import {Post} from '../../types/Post.tsx';
import {Comment, ReplyReturn} from '../../types/Comment.tsx';

import useFetch1Post from '../api/post/useFetch1Post.tsx';
import useLikePost from '../api/post/useLikePost.tsx';
import useUpdatePost from '../api/post/useUpdatePost.tsx';

import useCreateComment from '../api/comment/userCreateComment.tsx';
import useFetchComments from '../api/comment/useFetchComment.tsx';
import useLikeComment from '../api/comment/useLikeComment.tsx';
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
    const { likePost } = useLikePost();
    const { postUpdate } = useUpdatePost();

    // -----Comment states and actions-----
    const { comments, fetchComments } = useFetchComments();
    const { commentCreate } = useCreateComment();
    const { likeComment } = useLikeComment();
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
                Liked: comment.Liked,
                NoComments: comment.NoComments,
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
    const handleToggleLike = useCallback(async () => {
        if (postFetch) {
            const NoLikes = await likePost(postFetch.Title);
            setLocalPost(prev => 
                prev 
                    ? {...prev, NoLikes, Liked: !prev.Liked}
                    : prev
            )
        }
    }, [postFetch, likePost]);

    const handleUpdate = async (newTitle: string, newDetails: string) => {
        if (localPost) {
            await postUpdate(localPost.ID, newTitle, newDetails);

            const newPost: Post = {
                ID: localPost.ID,
                Title: newTitle,
                Details: newDetails,
                NoLikes: localPost.NoLikes,
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
    const handleSubmitComment = useCallback(async () => {
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
    }, [commentText, localPost, commentCreate]);

    const handleUpdateComment = (commentID: number, udpdateComment: string) => {
        setLocalComments(prev => 
            prev.map(comment => 
                comment.ID === commentID
                    ? {...comment, Comment: udpdateComment, Edited: true, EditedAt: new Date().toISOString()}
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

    const handleToggleLikeComment = async (commentID: number) => {
        const comment = localComments.find(c => c.ID === commentID);
        if (!comment) return;

        const NoLikes = await likeComment(commentID);
        setLocalComments(prev => prev.map(c => 
            c.ID === commentID
                ? {...c, NoLikes, Liked: !c.Liked}
                : c
        ));
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
        handleToggleLike,
        handleUpdate,
        handleEditDialogOpen,
        handleEditDialogClose,

        // Comment Actions
        handleSubmitComment,
        handleUpdateComment,
        handleDeleteComment,
        handleToggleLikeComment,
        handleReplyComment,
    }
};