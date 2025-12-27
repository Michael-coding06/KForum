import { Box, Typography, IconButton } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { BRAND_PRIMARY } from '../ForumPage/forum.constants.ts';

interface PostActionsProps {
  liked: boolean;
  noLikes: number;
  noComments: number;
  onLike?: () => void;
  onComment?: () => void;
}

const PostAction = ({ liked, noLikes, noComments, onLike, onComment }: PostActionsProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {/* Like Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          sx={{ color: '#666', '&:hover': { color: BRAND_PRIMARY } }}
          onClick={onLike}
        >
          {liked ? (
            <FavoriteIcon fontSize="small" />
          ) : (
            <FavoriteBorderOutlinedIcon fontSize="small" />
          )}
        </IconButton>
        <Typography sx={{ color: BRAND_PRIMARY, fontSize: '0.9rem' }}>
          {noLikes}
        </Typography>
      </Box>

      {/* Comment Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton
          size="small"
          sx={{ color: '#666', '&:hover': { color: BRAND_PRIMARY } }}
          onClick={onComment}
        >
          <ChatBubbleOutlineOutlinedIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ color: BRAND_PRIMARY, fontSize: '0.9rem' }}>
          {noComments}
        </Typography>
      </Box>
    </Box>
  );
};

export default PostAction;