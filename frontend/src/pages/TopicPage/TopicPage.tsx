import { useEffect, useState, useCallback, useMemo } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useOutletContext, useParams } from 'react-router-dom';
import Header from '../Header.tsx';
import PostList from './PostList.tsx';
import { Post } from '../../types/Post.tsx';
import { BRAND_PRIMARY, PRIMARY_BUTTON_STYLES } from '../ForumPage/forum.constants.ts';
import '../Page.css';
import CreateCard from './CreateCard.tsx';
import useCreatePost from '../../hooks/post/useCreatePost.tsx';
import useFetchPost from '../../hooks/post/useFetchPost.tsx';
import useLikePost from '../../hooks/post/useLikePost.tsx';

// import appEmitter from '../../utils/emitter.tsx';

const TopicPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const {topic} = useParams<string>();

  const topicTitle = topic?.replaceAll('_', ' ');
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  const {postCreate} = useCreatePost();
  const {likePost} = useLikePost();
  const {posts, fetchPosts} = useFetchPost();

  const [localPosts, setLocalPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (topicTitle) {
      fetchPosts(topicTitle);
    }
  }, [])

  useEffect(() => {
    setLocalPosts(posts
    ? posts.map(post => ({
        ID: post.ID,
        Title: post.Title,
        Details: post.Details,
        NoLikes: post.NoLikes,
        NoComments: 0,
        Edited: post.Edited,
        EditedAt: post.EditedAt,
        Liked: post.Liked,
        CreatedBy: post.CreatedBy,
      }))
    : []);
  }, [posts])

  const handleCreateSubmit = async (title: string, details: string) => {
    if (topicTitle) {
      const data = await postCreate(title, details, topicTitle)
      const newPost: Post = {
        ID: -1,
        Title: data[0],
        Details: data[1],
        NoLikes: 0,
        NoComments: 0,
        Edited: false,
        EditedAt: null,
        Liked: false, 
        CreatedBy: username,
      };

      setLocalPosts(prev => [...prev, newPost]);
    }
    setCreateDialogOpen(false);
  };

  const handleToggleLike = async (postID: number) => {
    const post = localPosts.find(p => p.ID === postID);
    if (!post) return;

    const NoLikes = await likePost(post.Title);

    setLocalPosts(prev =>
      prev.map(p =>
        p.ID === postID
          ? { ...p, NoLikes, Liked: !p.Liked }
          : p
      )
    );
  };

  const matchesSearch = useCallback(
    (post: Post) => {
      const term = searchTerm.toLowerCase();
      return (
        post.Title.toLowerCase().includes(term) ||
        post.Details.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const displayedPosts = useMemo(
    () => localPosts.filter(p => matchesSearch(p)),
    [localPosts, matchesSearch]
  )
  
  // console.log(displayedPosts)
  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      <Header 
        username={username}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pageType='post'
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Topic Header */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 5,
          pt: '70px',
          gap: 2
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: BRAND_PRIMARY
            }}
          >
            {topicTitle}
          </Typography>

          <Button
            variant="contained"
            sx={{
              ...PRIMARY_BUTTON_STYLES,
              borderRadius: '15px',
            }}
            onClick={() => setCreateDialogOpen(true)}
          >
            Create a Post
          </Button>
        </Box>

        <PostList 
          posts={displayedPosts} 
          onLike={handleToggleLike}
          username={username}
        />
        <CreateCard
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={handleCreateSubmit}
        />
      </Container>
    </Box>
  );
};

export default TopicPage;