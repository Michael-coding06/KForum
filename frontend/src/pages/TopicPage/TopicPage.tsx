import { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import Header from '../Header.tsx';
import PostList from './PostList.tsx';
import { Post } from '../../types/Post.tsx';
import { BRAND_PRIMARY, PRIMARY_BUTTON_STYLES } from '../ForumPage/forum.constants.ts';
import '../Page.css';

const MOCK_POSTS: Post[] = [
  {
    ID: 1,
    Topic: "Machine Learning Basics",
    Title: "What Is Machine Learning and Why Does It Matter?",
    Details: "Machine learning is a field of artificial intelligence that enables computers to learn from data instead of being explicitly programmed. This post introduces the basic concept of machine learning and explains why it plays a crucial role in modern technology such as recommendation systems and search engines.",
    NoLikes: 24,
    NoComments: 8,
    CreatedBy: "Sarah Chen"
  },
  {
    ID: 2,
    Topic: "Learning Methods",
    Title: "Supervised vs Unsupervised Learning: A Beginner's Guide",
    Details: "This post explains the difference between supervised and unsupervised learning. It covers common examples like classification, regression, and clustering, helping beginners understand when and why each approach is used.",
    NoLikes: 15,
    NoComments: 5,
    CreatedBy: "Alex Kumar"
  },
  {
    ID: 3,
    Topic: "Terminology",
    Title: "Key Terminologies in Machine Learning",
    Details: "New to machine learning? This post breaks down essential terms such as dataset, features, labels, model, training, testing, and overfitting in a clear and beginner-friendly way.",
    NoLikes: 32,
    NoComments: 12,
    CreatedBy: "Emma Rodriguez"
  },
  {
    ID: 4,
    Topic: "Model Training",
    Title: "How Does a Machine Learning Model Learn?",
    Details: "This post walks through the training process of a machine learning model, explaining how data is used to make predictions, calculate errors, and gradually improve performance over time.",
    NoLikes: 19,
    NoComments: 6,
    CreatedBy: "James Park"
  },
  {
    ID: 5,
    Topic: "Applications",
    Title: "Real-World Applications of Machine Learning",
    Details: "From spam detection and facial recognition to healthcare and finance, this post explores how machine learning is applied in real-life scenarios and why it is so impactful.",
    NoLikes: 41,
    NoComments: 15,
    CreatedBy: "Priya Sharma"
  }
];

const TOPIC_TITLE = 'Introduction to Machine Learning';

const TopicPage = () => {
  const { username } = useOutletContext<{ username: string }>();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Box sx={{ minHeight: '100vh' }} className="forum">
      <Header 
        username={username}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
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
            {TOPIC_TITLE}
          </Typography>

          <Button
            variant="contained"
            sx={{
              ...PRIMARY_BUTTON_STYLES,
              borderRadius: '15px',
            }}
          >
            Create a Post
          </Button>
        </Box>

        <PostList posts={MOCK_POSTS} />
      </Container>
    </Box>
  );
};

export default TopicPage;