import { 
  Box, 
  Typography 
} from '@mui/material';
import TopicCard from './TopicCard.tsx';
import { Topic } from '../../../types/Forum.tsx';
import { BRAND_PRIMARY } from '../../components/forum.constants.ts';

interface Props {
  topics: Topic[];
  emptyMessage?: string;
  onPin: (id: number) => void;
  onUpdate: (id: number, newTitle: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const TopicList = ({ topics, emptyMessage, onPin , onUpdate, onDelete}: Props) => {
  if (topics.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: BRAND_PRIMARY }}>
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {topics.map(topic => (
        <TopicCard key={topic.ID} topic={topic} onPin={onPin} onUpdate={onUpdate} onDelete={onDelete}/>
      ))}
    </Box>
  );
};

export default TopicList;