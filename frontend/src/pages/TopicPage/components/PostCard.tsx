import { Card, 
  CardContent, 
  Typography, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Post } from '../../../types/Post.tsx';
import Action from '../../components/Action.tsx';
import { BRAND_PRIMARY } from '../../components/forum.constants.ts';
import { timeAgo } from '../../../utils/TimeAgo.tsx';

interface PostCardProps {
  post: Post;
  onReact: (postID: number, typeReact: number) => void;
  username: string;
}

const PostCard = ({ post, onReact }: PostCardProps) => {
  const navigate = useNavigate();

  const handleLike = () => onReact(post.ID, 1);
  const handleDislike = () => onReact(post.ID, -1);

  const handleNavigate = () => {
    const postTitle = encodeURIComponent(post.Title.replaceAll(' ', '_'));
    navigate(`/post/${post.ID}/${postTitle}`)
  };

  return (
    <Card
      sx={{
        mb: 2.5,
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
          cursor: 'pointer',
        },
      }}
    >
      <CardContent
        sx={{
          px: 3,
          py: 3,
          borderTop: `4px solid ${BRAND_PRIMARY}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box>
            <Typography sx={{ color: '#955d14ff', fontWeight: 600 }}>
              K/{post.CreatedBy}
            </Typography>

            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: BRAND_PRIMARY }}
            >
              {post.Title}
            </Typography>
          </Box>
        </Box>

        {post.Edited && post.EditedAt && (
          <Typography
            variant="caption"
            sx={{
              color: '#955d14ff',
              fontStyle: 'italic',
              display: 'block',
              mb: 2,
            }}
          >
            • Edited {timeAgo(post.EditedAt)}
          </Typography>
        )}

        <Typography sx={{ color: BRAND_PRIMARY, mb: 2 }} onClick={handleNavigate}>
          {post.Details}
        </Typography>

        <Action
          liked={post.Liked}
          noLikes={post.NoLikes}
          disliked={post.Disliked}
          noDislikes={post.NoDislikes}
          noComments={post.NoComments}
          onLike={handleLike}
          onDislike={handleDislike}
          onComment={handleNavigate}
        />
      </CardContent>
    </Card>
  );
};

export default PostCard;
