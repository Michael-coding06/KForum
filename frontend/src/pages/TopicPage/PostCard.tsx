import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

import { Post } from '../../types/Post';
import PostAction from '../PostPage/Action.tsx';
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from '../ForumPage/forum.constants.ts';
// import { Edit } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { timeAgo } from '../../utils/TimeAgo.tsx';

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => void;
  username: string
}

const PostCard = ({ post, onLike, username }: PostCardProps) => {
  const navigate = useNavigate();
  const handleLike = () => {
    onLike(post.ID);
  }

  return (
    <Card 
      sx={{ 
        mb: 2.5,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          cursor: 'pointer'
        }
      }}
    >
            
      <CardContent sx={{ px: 3, py: 3, borderTop: `4px solid ${BRAND_PRIMARY}`}}>
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
              }}
            >
              K/{post.CreatedBy}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: BRAND_PRIMARY,
              }}
            >
              {post.Title}
            </Typography>
          </Box>

          {/* {post.CreatedBy === username && (
            <IconButton
              size="small"
              sx={{
                color: BRAND_PRIMARY_HOVER,
                '&:hover': {
                  backgroundColor: '#efd5cdff',
                },
              }}
              // onClick={handleOpenEdit}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )} */}
        </Box>

        {post.Edited && post.EditedAt && (
          <Typography
            variant="caption"
            sx={{ color: '#955d14ff', fontStyle: 'italic', marginBottom: 2, display: 'block'}}
          >
            • Edited {timeAgo(post.EditedAt)}
          </Typography>
        )}

        <Typography 
          sx={{ color: BRAND_PRIMARY, mb: 2 }}
          onClick = {() => navigate(`/post/${post.Title.replaceAll(' ', '_')}`, {
            state: {post}
          })}
        >
          {post.Details}
        </Typography>
        
        <PostAction
          liked={post.Liked}
          noLikes={post.NoLikes}
          noComments={post.NoComments}
          onLike={handleLike}
          // onComment={}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;