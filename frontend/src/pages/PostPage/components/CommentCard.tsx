import { CardContent, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PushPinIcon from '@mui/icons-material/PushPin';
import { useState } from 'react';

import Action from '../../components/Action.tsx';
import { Comment } from '../../../types/Comment.tsx';
import EditComment from './EditComment.tsx';
import ReplyInputCard from './ReplyInputCard.tsx';
import { timeAgo } from '../../../utils/TimeAgo.tsx';
import { ReplyReturn } from '../../../types/Comment.tsx';
import { useCommentManager } from '../../../hooks/manager/useCommentManager.ts';

interface CommentCardProps {
  comment: Comment;
  onReact: (ID: number, typeReact: number) => void;
  onReply: (commentID: number, reply: string) => Promise<ReplyReturn>;
  onSave: (ID: number, newComment: string) => void;
  onDelete: (commentID: number) => void;
  onPin: (commentID: number) => void;
  onUnPin: (commentID: number) => void;
  postOwner: string;
}

const CommentCard = ({ comment, onReact, onReply, onSave, onDelete, onPin, onUnPin, postOwner }: CommentCardProps) => {
  const { username } = useOutletContext<{ username: string }>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  
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
    handlePin,
    handleToggleReplyInput,
    handleToggleReplies,
    handleReply,
    handleToggleReactReply,
    handleDeleteReply,
  } = useCommentManager({ comment, username, onReact, onReply, onSave, onPin, onUnPin });

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box>
      <CardContent 
        sx={{ 
          px: 3, 
          py: 1,
          position: 'relative',
          '&:hover .menu-btn': { opacity: 1 },
        }}
      >
        {comment.IsPinned && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PushPinIcon
              sx={{
                fontSize: 20,
                color: '#955d14ff',
                transform: 'rotate(-45deg)',
              }}
            />
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography sx={{ color: '#955d14ff', fontWeight: 600, mb: 1 }}>
              K/{comment.CreatedBy}
            </Typography>

            {comment.Edited && comment.EditedAt && (
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#955d14ff', 
                  fontStyle: 'italic', 
                  mb: 2, 
                  display: 'block' 
                }}
              >
                • Edited {timeAgo(comment.EditedAt)}
              </Typography>
            )}

            <Typography sx={{ color: '#333', fontSize: '0.9rem', lineHeight: 1.5, mb: 1.5 }}>
              {comment.Comment}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
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
              sx={{ color: '#955d14ff', '&:hover': { color: '#666' } }}
            >
              {showReplies ? <RemoveIcon fontSize="small" /> : <AddIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
        
        {postOwner === username && (
          <Box className="menu-btn" sx={{ position: 'absolute', top: 8, right: 8, opacity: 0 }}>
            <IconButton 
              size="small" 
              onClick={handleMenuOpen}
              sx={{ color: '#955d14ff' }} 
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
            
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              {isCommentOwner && (
                <MenuItem 
                  onClick={() => { 
                    handleMenuClose(); 
                    handleEditDialogOpen(); 
                  }}
                  sx={{
                    color: '#955d14ff',
                    '&:hover': { backgroundColor: '#efd5cdff' }
                  }}
                >
                  <IconButton size="small" sx={{ color: '#955d14ff' }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <Typography sx={{ fontWeight: 'bold' }}>Edit</Typography>
                </MenuItem>
              )}

              <MenuItem 
                onClick={() => {
                  handleMenuClose();
                  handlePin();
                }} 
                sx={{
                  color: '#955d14ff', 
                  '&:hover': { backgroundColor: '#efd5cdff' } 
                }}
              >
                <IconButton size="small" sx={{ color: '#955d14ff' }}>
                  <PushPinIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ fontWeight: 'bold' }}>{comment.IsPinned ? 'Unpin' : 'Pin'}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
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

      {showReplies && localReplies.map((reply) => (
        <Box key={reply.ID} sx={{ marginLeft: 5 }}>
          <CommentCard
            comment={reply}
            onSave={onSave}
            onDelete={handleDeleteReply}
            onReact={handleToggleReactReply}
            onReply={onReply}
            onPin={onPin}
            onUnPin={onUnPin}
            postOwner={postOwner}
          />
        </Box>
      ))}
    </Box>
  );
};

export default CommentCard;