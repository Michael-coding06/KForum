import { 
  Box, 
  Container, 
  Typography, 
  Button } from '@mui/material';
import { useOutletContext, useParams } from 'react-router-dom';
import Header from '../components/Header.tsx';
import PostList from './components/PostList.tsx';
import { BRAND_PRIMARY, PRIMARY_BUTTON_STYLES } from '../components/forum.constants.ts';
import CreateCard from './components/CreateCard.tsx';
import { useTopicManager } from '../../hooks/manager/useTopicManager.ts';
import '../Page.css';


const TopicPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const { topicID, topicTitle } = useParams<{
    topicID: string,
    topicTitle: string
  }>();

  const title = topicTitle?.replaceAll('_', ' ');

  const {
    searchTerm,
    setSearchTerm,
    filteredPosts,
    createDialogOpen,
    handleCreateDialogOpen,
    handleCreateDialogClose,
    createTitle,
    setCreateTitle,
    createDetails,
    setCreateDetails,
    isFormValid,
    handleCreate,
    handleToggleReact
  } = useTopicManager(Number(topicID), username);

  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      <Header
        username={username}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pageType="post"
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Topic Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 5,
            pt: '70px',
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: BRAND_PRIMARY,
            }}
          >
            {title}
          </Typography>

          <Button
            variant="contained"
            sx={{
              ...PRIMARY_BUTTON_STYLES,
              borderRadius: '15px',
            }}
            onClick={handleCreateDialogOpen}
          >
            Create a Post
          </Button>
        </Box>

        <PostList
          posts={filteredPosts}
          onReact={handleToggleReact}
          username={username}
        />
        <CreateCard
          open={createDialogOpen}
          onClose={handleCreateDialogClose}
          onSubmit={handleCreate}

          title={createTitle}
          setTitle={setCreateTitle}
          details={createDetails}
          setDetails={setCreateDetails}
          isFormValid={isFormValid}
        />
      </Container>
    </Box>
  );
};

export default TopicPage;