import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { Post } from '../../types/Post';
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from '../ForumPage/forum.constants.ts';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
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
      <Box sx={{ height: 4, bgcolor: BRAND_PRIMARY }} />
      
      <CardContent sx={{ py: 3, px: 3 }}>
        <Typography 
            sx = {{
                color: '#955d14ff ',
                mb: 1,
                display: 'block',
                fontWeight: 600,
            }}
        >
            K/{post.CreatedBy}
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 1,
            fontWeight: 600,
            color: BRAND_PRIMARY
          }}
        >
          {post.Title}
        </Typography>
        
        <Typography sx={{ color: BRAND_PRIMARY, mb: 2 }}>
          {post.Details}
        </Typography>
        
        {/* Interaction Section */}
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <InteractionButton 
            icon={<FavoriteBorderOutlinedIcon fontSize="small" />}
            count={post.NoLikes}
          />
          <InteractionButton 
            icon={<ChatBubbleOutlineOutlinedIcon fontSize="small" />}
            count={post.NoComments}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// Extracted interaction button component
interface InteractionButtonProps {
  icon: React.ReactNode;
  count: number;
}

const InteractionButton = ({ icon, count }: InteractionButtonProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <IconButton 
      size="small" 
      sx={{ 
        color: '#666',
        '&:hover': { color: BRAND_PRIMARY }
      }}
    >
      {icon}
    </IconButton>
    <Typography sx={{ color: BRAND_PRIMARY, fontSize: '0.9rem' }}>
      {count}
    </Typography>
  </Box>
);

export default PostCard;