import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar,
  Button
} from '@mui/material';
import { Search } from 'lucide-react';
import { useOutletContext } from "react-router-dom";

import TopicList from './TopicList.tsx';
import CreateCard from './CreateCard.tsx';
import useCreateTopic from "../../hooks/topic/useCreateTopic.tsx";
import usePinTopic from '../../hooks/topic/usePinTopic.tsx';
import { Topic } from '../../types/Forum.tsx';
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from './forum.constants.ts';
import '../Page.css';
import logo from '../../image/logo.png';
import useFetchTopic from '../../hooks/topic/useFetchTopic.tsx';

const ForumPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const { topics, fetchTopics, loading, error } = useFetchTopic();
  const { topicCreate } = useCreateTopic();
  const { topicPin } = usePinTopic();
  
  const [localTopics, setLocalTopics] = useState<Topic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (topics) {
      setLocalTopics(topics);
    }
  }, [topics]);

  const filterBySearchTerm = (topic: Topic) => {
    const term = searchTerm.toLowerCase();
    return (
      topic.Title.toLowerCase().includes(term) ||
      topic.Description.toLowerCase().includes(term)
    );
  };

  const pinnedTopics = useMemo(() => {
    return localTopics.filter(t => t.Pinned && filterBySearchTerm(t));
  }, [localTopics, searchTerm]);

  const otherTopics = useMemo(() => {
    return localTopics.filter(t => !t.Pinned && filterBySearchTerm(t));
  }, [localTopics, searchTerm]);

  const handleCreateSubmit = async (title: string, description: string) => {
    const createdTopic = await topicCreate(title, description);
    const newTopic: Topic = {
      ID: -1, 
      Title: createdTopic[0],
      Description: createdTopic[1],
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

  const handleUpdateTopic = async (id: number, newTitle: string , newDescription: string) => {
    setLocalTopics(prev => 
      prev.map(t => 
        t.ID === id ? {...t, Title: newTitle, Description: newDescription} : t
      )
    )
  }

  const handleDeleteTopic = async(id: number) => {
    setLocalTopics(localTopics.filter(t => t.ID !== id))
  }
  const pinnedEmptyMessage = searchTerm 
    ? `No pinned topics found matching "${searchTerm}"`
    : "No pinned topics yet";
  
  const otherEmptyMessage = searchTerm 
    ? `No topics found matching "${searchTerm}"`
    : "No topics yet";

  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      <AppBar sx={{ bgcolor: BRAND_PRIMARY }}>
        <Toolbar>
          <img src={logo} alt="logo" className="logo" />

          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Hi, {username}
          </Typography>

          <Box sx={{ marginLeft: 'auto' }}>
            <TextField
              placeholder="Search topics..."
              className="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} color={BRAND_PRIMARY} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

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
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: BRAND_PRIMARY }}>
            Your Pinned Topics
          </Typography>

          <Button
            variant="contained"
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              bgcolor: BRAND_PRIMARY,
              textTransform: 'none',
              borderRadius: '15px',
              px: 2,
              '&:hover': {
                bgcolor: BRAND_PRIMARY_HOVER,
                transform: 'translateY(-2px)',
              },
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
          onDelete = {handleDeleteTopic}
        />

        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', color: BRAND_PRIMARY, mt: 6, mb: 3 }}
        >
          All Topics
        </Typography>

        <TopicList
          topics={otherTopics}
          emptyMessage={otherEmptyMessage}
          onPin={handlePinTopic}
          onUpdate = {handleUpdateTopic}
          onDelete = {handleDeleteTopic}
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