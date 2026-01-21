import {
    Box,
    Container,
    Typography,
    Button
} from '@mui/material';

import { useOutletContext } from 'react-router-dom';

import TopicList from './components/TopicList.tsx';
import Header from '../components/Header.tsx';
import CreateCard from './components/CreateCard.tsx';
import { useForumManager } from '../../hooks/manager/useForumManager.ts';

import { BRAND_PRIMARY, PRIMARY_BUTTON_STYLES } from '../components/forum.constants.ts';
const ForumPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const {
    searchTerm,
    setSearchTerm,
    pinnedTopics,
    otherTopics,
    createDialogOpen,
    setCreateDialogOpen,
    handleCreate,
    handleUpdate,
    handleDelete,
    handlePin,
  } = useForumManager();

  const pinnedEmptyMessage = searchTerm
    ? `No pinned topics found matching "${searchTerm}"`
    : 'No pinned topics yet';

  const otherEmptyMessage = searchTerm
    ? `No topics found matching "${searchTerm}"`
    : 'No topics yet';

  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      {/* Header */}
      <Header
        username={username}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pageType="topic"
      />

        {/* Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            pt: '70px',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 'bold', color: BRAND_PRIMARY }}
          >
            Your Pinned Topics
          </Typography>

          <Button
            variant="contained"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
                ...PRIMARY_BUTTON_STYLES,
                borderRadius: '15px',
            }}
          >
            Create a Topic
          </Button>
        </Box>

        <TopicList
          topics={pinnedTopics}
          emptyMessage={pinnedEmptyMessage}
          onPin={handlePin}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: BRAND_PRIMARY,
            mt: 6,
            mb: 3,
          }}
        >
            All Topics
        </Typography>

        <TopicList
          topics={otherTopics}
          emptyMessage={otherEmptyMessage}
          onPin={handlePin}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </Container>

      <CreateCard
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </Box>
  );
}

export default ForumPage