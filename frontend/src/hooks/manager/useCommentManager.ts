import {
    useEffect,
    useState,
} from 'react';

import { Comment, ReplyReturn } from '../../types/Comment.tsx';

// ------Import Hooks------
import useFetchReply from '../api/comment/useFetchReply.tsx';
import useUpdateCommment from '../api/comment/useUpdateComment.tsx';
import useDeleteComment from '../api/comment/useDeleteComment.tsx';
import useReactComment from '../api/comment/useReactComment.tsx';
import usePinCommnet from '../api/comment/usePinCommnet.tsx';

interface UseCommentManagerProps {
    comment: Comment;
    username: string;
    onReact: (ID: number, typeReact: number) => void;
    onReply: (commentID: number, reply: string) => Promise<ReplyReturn>;
    onSave: (ID: number, newComment: string) => void;
    onPin: (commentID: number) => void;
    onUnPin: (commentID: number) => void;
}

export const useCommentManager = ({
    comment,
    username,
    onReact,
    onReply,
    onSave,
    onPin,
    onUnPin
}: UseCommentManagerProps) => {
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
    const [showReplyInput, setShowReplyInput] = useState<boolean>(false);
    const [showReplies, setShowReplies] = useState<boolean>(false);
    const [localReplies, setLocalReplies] = useState<Comment[]>([]);

    // ------Comment states and actions-----
    const { replies, fetchReplies } = useFetchReply();
    const { reactComment } = useReactComment();
    const { commentUpdate } = useUpdateCommment();
    const { commentDelete } = useDeleteComment();
    const { pinComment } = usePinCommnet();

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
        onReact(comment.ID, 1);
    };

    const handleDislike = () => {
        onReact(comment.ID, -1);
    };

    const handlePin = async () => {
        await pinComment(comment.ID);
        if (comment.IsPinned) {
            onUnPin(comment.ID)
        } else {
            onPin(comment.ID);
        }
    }

    // -----Reply Actions-----
    const handleToggleReplyInput = () => {
        setShowReplyInput(!showReplyInput);
    };

    const handleToggleReplies = () => {
        setShowReplies(!showReplies);
    };

    const handleReply = async (reply: string) => {
        const data = await onReply(comment.ID, reply);
        if (!data) {return}
        const newReply: Comment = {
            ID: data.id,
            Comment: data.comment,
            CreatedBy: data.created_by,
            NoLikes: 0,
            NoDislikes:0,
            CreatedAt: null,
            Liked: false,
            Disliked: false,
            Edited: false,
            EditedAt: null,
            NoComments: 0,
            IsPinned: false,
            ParentComment: comment.ID,
        };
        setLocalReplies(prev => [...prev, newReply]); // push reply to the back
        setShowReplies(true);
        setShowReplyInput(false);
    };

    const handleToggleReactReply = async (commentID: number, typeReact: number) => {
        const NoReactions = await reactComment(commentID, typeReact);

        setLocalReplies(prev =>
            prev.map(c =>
                c.ID === commentID
                ? {
                    ...c,
                    NoLikes: NoReactions[1],
                    NoDislikes: NoReactions[0],
                    Liked: typeReact === 1 ? !c.Liked : false,
                    Disliked: typeReact === -1 ? !c.Disliked : false,
                }
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
        handleDislike,
        handlePin,

        handleToggleReplyInput,
        handleToggleReplies,
        handleReply,
        handleToggleReactReply,
        handleDeleteReply,
    };
};