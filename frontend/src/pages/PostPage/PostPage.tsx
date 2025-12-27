import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Container,
  TextField,
} from '@mui/material';
import { replace, useOutletContext, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import Header from '../Header.tsx';
import CommentCard from './CommentCard.tsx';
import PostAction from './Action.tsx';
import { Post } from '../../types/Post.tsx';
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from '../ForumPage/forum.constants.ts';

import useFetch1Post from '../../hooks/post/useFetch1Post.tsx';
import useLikePost from '../../hooks/post/useLikePost.tsx';

import EditCard from './EditCard.tsx';
import { timeAgo } from '../../utils/TimeAgo.tsx';
// import { Details } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import useCreateComment from '../../hooks/comment/userCreateComment.tsx';

const MOCK_COMMENTS = [
  {
    name: '0Khoa',
    comment:
      'Great overview of how machine learning shows up in apps we use every day.',
  },
  {
    name: '1Khoa',
    comment:
      'Nice explanation! Spam detection example was especially interesting.',
  },
  {
    name: '2Khoa',
    comment:
      'Very beginner-friendly post. Machine learning feels less intimidating now.',
  },
  {
    name: '3Khoa',
    comment:
      'It’s amazing how much ML works behind the scenes without us noticing.',
  },
];

const PostPage = () => {
  const { post } = useParams<string>();
  const title = post?.replaceAll('_', ' ');
  const { username } = useOutletContext<{ username: string }>();
  const [localPost, setLocalPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const {likePost} = useLikePost();

  const {commentCreate} = useCreateComment();

  const navigate = useNavigate();


  const { postFetch, fetch1Post } = useFetch1Post();

  // if (postFetch) {return}

  useEffect(() => {
    if (title) {
      fetch1Post(title);
    }
  }, [title]);

  useEffect(() => {
    if (postFetch) setLocalPost(postFetch);
  }, [postFetch]);

  const isPostOwner = localPost?.CreatedBy === username;

  const handleToggleLike = async () => {
    if (postFetch) {
        const NoLikes = await likePost(postFetch.Title)
        setLocalPost(prev =>
            prev
                ? {
                    ...prev,
                    NoLikes,
                    Liked: !prev.Liked,
                }
                : prev
        );
    }
  };

  const handleSubmitComment = async() => {
    if (!commentText.trim()) return;
    if (localPost) {
      console.log(commentText, localPost.ID)
      await commentCreate(commentText, localPost.ID)
    }
    setCommentText('');
  };

  const handleUpdate = (newTitle: string, newDetails: string) => {
    if (localPost) {
      const newPost: Post = {
        ID: localPost.ID,
        Title: newTitle,
        Details: newDetails,
        NoLikes: localPost?.NoLikes,
        NoComments: localPost.NoComments,
        Edited: localPost.Edited,
        EditedAt: localPost.EditedAt,
        Liked: localPost.Liked,
        CreatedBy: localPost.CreatedBy
      }
      setLocalPost(newPost);
      navigate(`/post/${newPost.Title}`, {replace: true})
    }
  }
  
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
                  sx={{ color: BRAND_PRIMARY_HOVER, '&:hover': { backgroundColor: '#efd5cdff' } }}
                >
                  <EditIcon 
                    fontSize="small" 
                    onClick={() => setCreateDialogOpen(true)}
                  />
                </IconButton>
              )}
            </Box>

            {localPost.Edited && localPost.EditedAt && (
                <Typography
                  variant="caption"
                  sx={{ color: '#955d14ff', fontStyle: 'italic', marginBottom: 2, display: 'block'}}
                >
                  • Edited {timeAgo(localPost.EditedAt)}
                </Typography>
              )}

            <Typography sx={{ color: BRAND_PRIMARY, mb: 2 }}>
              {localPost.Details}
            </Typography>

            <PostAction
              liked={localPost.Liked}
              noLikes={localPost.NoLikes}
              noComments={localPost.NoComments}
              onLike={handleToggleLike}
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
          {MOCK_COMMENTS.map((comment, index) => (
            <CommentCard key={index} comment={comment} />
          ))}
        </Box>
      </Container>

      <EditCard
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        post={localPost}
        onSave={handleUpdate}
        // username={username}
      />
    </Box>
  );
};

export default PostPage;
