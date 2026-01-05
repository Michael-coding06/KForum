import { CardContent, Typography, Box, IconButton } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import Action from '../../components/Action.tsx';
import { Comment } from '../../../types/Comment.tsx';
import EditComment from './EditComment.tsx';
import ReplyInputCard from './ReplyInputCard.tsx';
import { timeAgo } from '../../../utils/TimeAgo.tsx';
import { BRAND_PRIMARY } from '../../components/forum.constants.ts';
import { ReplyReturn } from '../../../types/Comment.tsx';
import { useCommentManager } from '../../../hooks/manager/useCommentManager.ts';

interface CommentCardProps {
  comment: Comment;
  onReact: (ID: number, typeReact: number) => void;
  onReply: (commentID: number, reply: string) => Promise<ReplyReturn>;
  onSave: (ID: number, newComment: string) => void;
  onDelete: (commentID: number) => void;
}

const CommentCard = ({ comment, onReact, onReply, onSave, onDelete }: CommentCardProps) => {
  const { username } = useOutletContext<{ username: string }>();
  
  const {
    editDialogOpen,
    showReplyInput,
    showReplies,
    localReplies,
    isCommentOwner,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleUpdate,
    handleLike,
    handleDislike,
    handleToggleReplyInput,
    handleToggleReplies,
    handleReply,
    handleToggleReactReply,
    handleDeleteReply,
  } = useCommentManager({comment, username, onReact, onReply, onSave});

  console.log("This is the local replies: ",localReplies)

  return (
    <Box>
      <CardContent sx={{ px: 3, py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#955d14ff',
                fontWeight: 600,
                mb: 1,
              }}
            >
              K/{comment.CreatedBy}
            </Typography>

            {comment.Edited && comment.EditedAt && (
              <Typography
                variant="caption"
                sx={{
                  color: '#955d14ff',
                  fontStyle: 'italic',
                  marginBottom: 2,
                  display: 'block',
                }}
              >
                • Edited {timeAgo(comment.EditedAt)}
              </Typography>
            )}

            <Typography
              sx={{
                color: '#333',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                mb: 1.5,
              }}
            >
              {comment.Comment}
            </Typography>
          </Box>

          {isCommentOwner && (
            <IconButton
              size="small"
              onClick={handleEditDialogOpen}
              sx={{
                color: '#955d14ff',
                '&:hover': { backgroundColor: '#efd5cdff' },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Action
            liked={comment.Liked}
            disliked={comment.Disliked}
            noLikes={comment.NoLikes ?? 0}
            noDislikes={comment.NoDislikes ?? 0}
            noComments={null}
            onLike={handleLike}
            onDislike={handleDislike}
            onComment={handleToggleReplyInput}
          />
          {localReplies.length > 0 && (
            <IconButton
              size="small"
              onClick={handleToggleReplies}
              sx={{
                color: BRAND_PRIMARY,
                '&:hover': {
                  color: '#666',
                },
              }}
            >
              {showReplies ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
      </CardContent>

      <EditComment
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        comment={comment}
        onSave={handleUpdate}
        onDelete={onDelete}
      />

      {showReplyInput && (
        <Box sx={{ marginLeft: 5 }}>
          <ReplyInputCard onReply={handleReply} />
        </Box>
      )}

      {showReplies &&
        localReplies.map((reply) => (
          <Box key={reply.ID} sx={{ marginLeft: 5 }}>
            <CommentCard
              comment={reply}
              onSave={onSave}
              onDelete={handleDeleteReply}
              onReact={handleToggleReactReply}
              onReply={onReply}
            />
          </Box>
        ))}
    </Box>
  );
};

export default CommentCard;