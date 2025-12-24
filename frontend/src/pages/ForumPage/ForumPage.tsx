import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import { useOutletContext } from 'react-router-dom';

import TopicList from './TopicList.tsx';
import CreateCard from './CreateCard.tsx';

import useFetchTopic from '../../hooks/topic/useFetchTopic.tsx';
import useCreateTopic from '../../hooks/topic/useCreateTopic.tsx';
import usePinTopic from '../../hooks/topic/usePinTopic.tsx';
import Header from '../Header.tsx'

import { Topic } from '../../types/Forum.tsx';
import {
  BRAND_PRIMARY,
  PRIMARY_BUTTON_STYLES,
} from './forum.constants.ts';

// import '../Page.css';


const ForumPage = () => {
  const { username } = useOutletContext<{ username: string }>();

  const { topics, fetchTopics } = useFetchTopic();
  const { topicCreate } = useCreateTopic();
  const { topicPin } = usePinTopic();

  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics) setLocalTopics(topics);
  }, [topics]);

  const matchesSearch = useCallback(
    (topic: Topic) => {
      const term = searchTerm.toLowerCase();
      return (
        topic.Title.toLowerCase().includes(term) ||
        topic.Description.toLowerCase().includes(term)
      );
    },
    [searchTerm]
  );

  const pinnedTopics = useMemo(
    () => localTopics.filter(t => t.Pinned && matchesSearch(t)),
    [localTopics, matchesSearch]
  );

  const otherTopics = useMemo(
    () => localTopics.filter(t => !t.Pinned && matchesSearch(t)),
    [localTopics, matchesSearch]
  );

  const handleCreateSubmit = async (title: string, description: string) => {
    const [createdTitle, createdDescription] = await topicCreate(
      title,
      description
    );

    const newTopic: Topic = {
      ID: -1,
      Title: createdTitle,
      Description: createdDescription,
      Pinned: false,
      Created: true,
    };

    setLocalTopics(prev => [...prev, newTopic]);
    setCreateDialogOpen(false);
  };

  const handlePinTopic = async (id: number) => {
    const topic = localTopics.find(t => t.ID === id);
    if (!topic) return;

    await topicPin(topic.Title);

    setLocalTopics(prev =>
      prev.map(t =>
        t.ID === id ? { ...t, Pinned: !t.Pinned } : t
      )
    );
  };

  const handleUpdateTopic = (
    id: number,
    newTitle: string,
    newDescription: string
  ) => {
    setLocalTopics(prev =>
      prev.map(t =>
        t.ID === id
          ? { ...t, Title: newTitle, Description: newDescription }
          : t
      )
    );
  };

  const handleDeleteTopic = (id: number) => {
    setLocalTopics(prev => prev.filter(t => t.ID !== id));
  };

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
        pageType='topic'
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
          onPin={handlePinTopic}
          onUpdate={handleUpdateTopic}
          onDelete={handleDeleteTopic}
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
          onPin={handlePinTopic}
          onUpdate={handleUpdateTopic}
          onDelete={handleDeleteTopic}
        />
      </Container>

      <CreateCard
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </Box>
  );
};

export default ForumPage;
