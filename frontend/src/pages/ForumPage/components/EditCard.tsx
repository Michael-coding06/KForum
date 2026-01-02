import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { X } from 'lucide-react';

import {
  BRAND_PRIMARY,
  TEXT_FIELD_STYLES,
  PRIMARY_BUTTON_STYLES,
} from '../../components/forum.constants.ts';

import useUpdateTopic from '../../../hooks/api/topic/useUpdateTopic.tsx';
import useDeleteTopic from '../../../hooks/api/topic/useDeleteTopic.tsx';
import { Topic } from '../../../types/Forum.tsx';

interface EditCardProps {
  open: boolean;
  onClose: () => void;
  topic: Topic;
  onUpdate: (id: number, newTitle: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const EditCard = ({
  open,
  onClose,
  topic,
  onUpdate,
  onDelete,
}: EditCardProps) => {
  const [title, setTitle] = useState<string>(topic.Title || '');
  const [description, setDescription] = useState(topic.Description || '');

  const { topicUpdate } = useUpdateTopic();
  const { topicDelete } = useDeleteTopic();

  const isFormValid = title.trim() !== '' && description.trim() !== '';

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    await topicUpdate(topic.ID, title, description);
    onUpdate(topic.ID, title, description);
    handleClose();
  };

  const handleDelete = async () => {
    await topicDelete(topic.ID);
    onDelete(topic.ID);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '15px',
          p: 3,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
        }}
      >
        <DialogTitle
          sx={{
            p: 1,
            fontSize: '1.1rem',
            fontWeight: 600,
            color: BRAND_PRIMARY,
          }}
        >
          Edit topic
        </DialogTitle>

        <IconButton onClick={handleClose} size="small">
          <X size={18} color={BRAND_PRIMARY} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 1, mt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="New Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={TEXT_FIELD_STYLES}
          />

          <TextField
            label="Description"
            size="small"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={TEXT_FIELD_STYLES}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          mt: 2,
          px: 1,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleDelete}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            borderRadius: '10px',
            bgcolor: '#AE887B',
            color: '#fff',
            '&:hover': { bgcolor: 'red' },
          }}
        >
          Delete
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          sx={{
            ...PRIMARY_BUTTON_STYLES,
            fontWeight: 600,
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCard;
