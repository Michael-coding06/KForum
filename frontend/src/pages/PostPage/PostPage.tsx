import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Container,
  TextField,
} from '@mui/material';
import { useOutletContext, useNavigate, useParams} from 'react-router-dom';
import { useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';

import Header from '../components/Header.tsx';
import CommentCard from './components/CommentCard.tsx';
import Action from '../components/Action.tsx';
import EditCard from './components/EditCard.tsx';
import { timeAgo } from '../../utils/TimeAgo.tsx';
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from '../components/forum.constants.ts';
import { usePostManager } from '../../hooks/manager/usePostManager.ts';

import {io} from "socket.io-client";

const PostPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const navigate = useNavigate();
  const { postID, postTitle } = useParams<{
    postID: string,
    postTitle: string
  }>();

  const {
    localPost,
    topLevelComments,
    searchTerm,
    setSearchTerm,
    commentText,
    setCommentText,
    editDialogOpen,
    isPostOwner,
    handleToggleReact,
    handleUpdate,
    handleEditDialogOpen,
    handleEditDialogClose,
    handleSubmitComment,
    handleUpdateComment,
    handleDeleteComment,
    handleToggleReactComment,
    handleReplyComment,

    handlePinComment,
    handleUnPinComment,
    handleSocketComment,
  } = usePostManager(Number(postID), username);

  const handleSaveUpdate = async (newTitle: string, newDetails: string) => {
    const updatedPost = await handleUpdate(newTitle, newDetails);
    if (updatedPost) {
      navigate(`/post/${postID}/${updatedPost.Title}`, { replace: true });
    }
    handleEditDialogClose();
  };

  // 1 for like, -1 for dislike
  const handleLike = () => handleToggleReact(1);
  const handleDislike = () => handleToggleReact(-1);

  // Connect to socket server right after get into post page
  useEffect(() => {
    const socket = io(process.env.REACT_APP_BACKEND_SOCKET_URL); 

    socket.on("connect", () => {
      console.log("connected to socket:", socket.id);
    });

    socket.on("new_comment", (comment) => {
      console.log('Received comment: ', comment);
      handleSocketComment();
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!localPost) return <Typography>Loading post...</Typography>;

  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      <Header
        username={username}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pageType="post"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mt: 10, mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ px: 3, py: 3, borderTop: `4px solid ${BRAND_PRIMARY}` }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Box>
                <Typography sx={{ color: '#955d14ff', fontWeight: 600 }}>
                  K/{localPost.CreatedBy}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, color: BRAND_PRIMARY }}>
                  {localPost.Title}
                </Typography>
              </Box>

              {isPostOwner && (
                <IconButton
                  size="small"
                  onClick={handleEditDialogOpen}
                  sx={{ color: BRAND_PRIMARY_HOVER, '&:hover': { backgroundColor: '#efd5cdff' } }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {localPost.Edited && localPost.EditedAt && (
              <Typography
                variant="caption"
                sx={{ color: '#955d14ff', fontStyle: 'italic', marginBottom: 2, display: 'block' }}
              >
                • Edited {timeAgo(localPost.EditedAt)}
              </Typography>
            )}

            <Typography sx={{ color: BRAND_PRIMARY, mb: 2 }}>
              {localPost.Details}
            </Typography>

            <Action
              liked={localPost.Liked}
              noLikes={localPost.NoLikes}
              disliked={localPost.Disliked}
              noDislikes={localPost.NoDislikes}
              noComments={localPost.NoComments}
              onLike={handleLike}
              onDislike={handleDislike}
            />
          </CardContent>
        </Card>

        <TextField
          fullWidth
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmitComment();
              console.log(topLevelComments)
            }
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 5,
              bgcolor: '#F5F0E8',
              '& fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: '1px solid #AE887B' },
            },
          }}
        />
        
        <Box>
          {topLevelComments.map((comment) => (
            <CommentCard
              key={comment.ID}
              comment={comment}
              onSave={handleUpdateComment}
              onDelete={handleDeleteComment}
              onReact={handleToggleReactComment}
              onReply={handleReplyComment}
              onPin={handlePinComment}
              onUnPin={handleUnPinComment}
              postOwner={localPost.CreatedBy}
            />
          ))}
        </Box>
      </Container>

      <EditCard
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        post={localPost}
        onSave={handleSaveUpdate}
      />
    </Box>
  );
};

export default PostPage;