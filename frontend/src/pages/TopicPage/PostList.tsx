import { Box, Typography } from '@mui/material';
import {Post} from '../../types/Post.tsx'
import PostCard from './PostCard.tsx';

interface Props {
    posts: Post[]
}
const PostList = ({posts}: Props) => {
    return (
        <Box sx ={{flex: '1'}}>
            {posts.map(post => (
                <PostCard post = {post}/>
            ))}
        </Box>
    );
}

export default PostList;