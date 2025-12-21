import { useState, useMemo, useEffect } from 'react';

import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { LABEL_COLORS, BRAND_PRIMARY } from './forum.constants.ts';
import { Topic } from '../../types/Forum.tsx';

import PushPinIcon from '@mui/icons-material/PushPin';
import EditIcon from '@mui/icons-material/Edit';
import EditCard from './EditCard.tsx';

interface Props {
  topic: Topic;
  onPin: (id: number) => void;
  onUpdate: (id: number, newTitle: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const TopicCard = ({ topic, onPin , onUpdate, onDelete}: Props) => {
  const handlePin = () => {
    onPin(topic.ID);
  };

  const [editOpen, setEditOpen] = useState<boolean>(false);
  const handleOpenEdit = () => {
    setEditOpen(true);
  }


  return (
    <Card
      className="card"
      sx={{
        position: 'relative',
        '&:hover': {
          borderLeft: `4px solid ${LABEL_COLORS[topic.Created ? 'created' : 'none']}`,
        },
      }}
    >
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
            onClick = {handleOpenEdit}
            sx={{
              color: LABEL_COLORS[topic.Created ? 'created' : 'none'],
              padding: 0.2,
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

      <CardContent
        sx={{
          py: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
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
              color: LABEL_COLORS['created'],
              fontWeight: 'bold',
              textTransform: 'capitalize',
              minWidth: '80px',
            }}
          />
        )}
      </CardContent>

      <EditCard
        open = {editOpen}
        onClose={() => setEditOpen(false)}
        topicID = {topic.ID}
        onUpdate = {onUpdate}
        onDelete = {onDelete}
      />
      
    </Card>
  );
};

export default TopicCard;