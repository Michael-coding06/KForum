import {
    useEffect,
    useState,
} from 'react';

import { Comment, ReplyReturn } from '../../types/Comment.tsx';
import useFetchReply from '../api/comment/useFetchReply.tsx';
import useLikeComment from '../api/comment/useLikeComment.tsx';
import useUpdateCommment from '../api/comment/useUpdateComment.tsx';
import useDeleteComment from '../api/comment/useDeleteComment.tsx';

interface UseCommentManagerProps {
    comment: Comment;
    username: string;
    onLike: (ID: number) => void;
    onReply: (commentID: number, reply: string) => Promise<ReplyReturn>;
    onSave: (ID: number, newComment: string) => void;
}

export const useCommentManager = ({
    comment,
    username,
    onLike,
    onReply,
    onSave,
}: UseCommentManagerProps) => {
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [localReplies, setLocalReplies] = useState<Comment[]>([]);

    const { replies, fetchReplies } = useFetchReply();
    const { likeComment } = useLikeComment();
    const { commentUpdate } = useUpdateCommment();
    const { commentDelete } = useDeleteComment();

    // -----Fetch replies-----
    useEffect(() => {
        fetchReplies(comment.ID);
    }, [comment.ID]);

    useEffect(() => {
        if (replies) {
            setLocalReplies(replies);
        }
    }, [replies]);

    // -----Check if user owns the comment-----
    const isCommentOwner = comment.CreatedBy === username;

    // -----Dialog Actions-----
    const handleEditDialogOpen = () => {
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
    };

    // -----Comment Actions-----
    const handleUpdate = async (newComment: string) => {
        await commentUpdate(comment.ID, newComment);

        onSave(comment.ID, newComment);
        setEditDialogOpen(false);
    };

    const handleLike = () => {
        onLike(comment.ID);
    };

    // -----Reply Actions-----
    const handleToggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
    };

    const handleToggleReplies = () => {
        setShowReplies(!showReplies);
    };

    const handleReply = async (reply: string) => {
        const data = await onReply(comment.ID, reply);
        const newReply: Comment = {
            ID: data.id,
            Comment: data.comment,
            CreatedBy: data.created_by,
            NoLikes: 0,
            CreatedAt: null,
            Liked: false,
            Edited: false,
            EditedAt: null,
            ParentComment: comment.ID,
        };
        setLocalReplies(prev => [...prev, newReply]);
        setShowReplies(true);
        setShowReplyInput(false);
    };

    const handleToggleLikeReply = async (commentID: number) => {
        const comment = localReplies.find(c => c.ID === commentID);
        if (!comment) return;

        const NoLikes = await likeComment(commentID);

        setLocalReplies(prev =>
            prev.map(c =>
                c.ID === commentID
                    ? { ...c, NoLikes, Liked: !c.Liked }
                    : c
            )
        );
    };

    const handleDeleteReply = async(replyID: number) => {
        await commentDelete(replyID);
        setLocalReplies(prev => prev.filter(reply => reply.ID !== replyID));
    };

    return {
        // State
        editDialogOpen,
        showReplyInput,
        showReplies,
        localReplies,
        isCommentOwner,

        // Actions
        handleEditDialogOpen,
        handleEditDialogClose,
        handleUpdate,
        handleLike,
        handleToggleReplyInput,
        handleToggleReplies,
        handleReply,
        handleToggleLikeReply,
        handleDeleteReply,
    };
};