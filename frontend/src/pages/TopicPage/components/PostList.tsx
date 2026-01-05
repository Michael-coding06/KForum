import { 
    Box, 
    Typography 
} from '@mui/material';
import {Post} from '../../../types/Post.tsx'
import PostCard from '../components/PostCard.tsx';
import { BRAND_PRIMARY } from '../../components/forum.constants.ts';

interface Props {
    posts: Post[]
    onReact: (postId: number, typeReact: number) => void;
    username: string
}
const PostList = ({posts, onReact, username}: Props) => {
    return (
        <Box sx={{ flex: '1' }}>
            {posts.length === 0 ? (
            <Typography
                variant="body1"
                fontSize={30}
                align="center"
                sx={{ mt: 10,
                    color: BRAND_PRIMARY
                }}
            >
                No posts yet. Be the first to create one.
            </Typography>
            ) : (
            posts.map(post => (
                <PostCard key={post.ID} post={post} onReact = {onReact} username={username}/>
            ))
            )}
        </Box>
    );
}

export default PostList;