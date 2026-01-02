import { useState } from 'react';

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip 
} from '@mui/material';

import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';

import { LABEL_COLORS, BRAND_PRIMARY } from '../../components/forum.constants.ts';
import { Topic } from '../../../types/Forum.tsx';
import EditCard from './EditCard.tsx';

import { useNavigate } from 'react-router-dom';


interface Props {
  topic: Topic;
  onPin: (id: number) => void;
  onUpdate: (id: number, newTitle: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const TopicCard = ({ topic, onPin, onUpdate, onDelete }: Props) => {
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  const handlePin = () => {
    onPin(topic.ID);
  };

  const handleOpenEdit = () => {
    setEditOpen(true);
  };

  

  return (
    <Card
      className="card"
      sx={{
        position: 'relative',
        '&:hover': {
          borderLeft: `4px solid ${
            LABEL_COLORS[topic.Created ? 'created' : 'none']
          }`,
        },
      }}
    >
      {/* Actions */}
      <Box
        sx={{
          position: 'absolute',
          top: 5,
          right: 5,
          display: 'flex',
          gap: 1,
        }}
      >
        {topic.Created && (
          <EditIcon
            onClick={handleOpenEdit}
            sx={{
              color: LABEL_COLORS.created,
              p: 0.2,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#efd5cdff',
                borderRadius: '50%',
              },
            }}
          />
        )}

        <PushPinIcon
          onClick={handlePin}
          sx={{
            color: LABEL_COLORS[topic.Created ? 'created' : 'none'],
            p: 0.3,
            cursor: 'pointer',
            transform: topic.Pinned ? 'rotate(45deg)' : 'none',
            '&:hover': {
              backgroundColor: '#efd5cdff',
              borderRadius: '50%',
            },
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          py: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick = {() => navigate(`/topic/${topic.Title.replaceAll(' ', '_')}`)}
      >
        <Box>
          <Typography variant="h6">{topic.Title}</Typography>
          <Typography sx={{ color: BRAND_PRIMARY }}>
            {topic.Description}
          </Typography>
        </Box>

        {topic.Created && (
          <Chip
            label="created"
            sx={{
              color: LABEL_COLORS.created,
              fontWeight: 'bold',
              textTransform: 'capitalize',
              minWidth: '80px',
            }}
          />
        )}
      </CardContent>

      {/* Edit Dialog */}
      <EditCard
        open={editOpen}
        onClose={() => setEditOpen(false)}
        topic={topic}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </Card>
  );
};

export default TopicCard;
