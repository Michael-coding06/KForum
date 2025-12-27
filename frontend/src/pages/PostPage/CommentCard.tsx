import { Card, CardContent, Typography } from '@mui/material';
import PostAction from './Action.tsx';
import {Comment} from '../../types/Comment.tsx'

interface CommentCardProps {
  comment: Comment;
  onLike?: () => void;
  onComment?: () => void;
}

const CommentCard = ({ comment, onLike, onComment }: CommentCardProps) => {
  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
        borderLeft: '3px solid #AE887B',
        bgcolor: 'transparent',
      }}
    >
      <CardContent sx={{ px: 3, py: 2.5 }}>
        <Typography
          sx={{
            color: '#955d14ff',
            fontWeight: 600,
            mb: 1,
          }}
        >
          K/{comment.name}
        </Typography>

        <Typography
          sx={{
            color: '#333',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            mb: 1.5,
          }}
        >
          {comment.comment}
        </Typography>

        <PostAction
          liked={comment.liked ?? false}
          noLikes={comment.noLikes ?? 0}
          noComments={comment.noComments ?? 0}
          onLike={onLike}
          onComment={onComment}
        />
      </CardContent>
    </Card>
  );
};

export default CommentCard;