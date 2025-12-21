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
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER } from './forum.constants.ts';
import useUpdateTopic from '../../hooks/topic/useUpdateTopic.tsx';
import useDeleteTopic from '../../hooks/topic/useDeleteTopic.tsx';

interface EditCardProps {
  open: boolean;
  onClose: () => void;
  topicID: number;
  onUpdate: (id: number, newTitle: string, newDescription: string) => void;
  onDelete: (id: number) => void;
}

const EditCard = ({ open, onClose, topicID, onUpdate, onDelete}: EditCardProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const {topicUpdate} = useUpdateTopic();
  const {topicDelete} = useDeleteTopic();

  const isFormValid = Boolean(title.trim() && description.trim());

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await topicUpdate(topicID, title, description)
    // console.log(topicID, title, description)
    onUpdate(topicID, title, description)
    handleClose();
  };

  const handleDelete = async () => {
    await topicDelete(topicID);
    onDelete(topicID)
    handleClose();
  }
 
  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': { borderColor: BRAND_PRIMARY },
      '&.Mui-focused fieldset': { borderColor: BRAND_PRIMARY },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: BRAND_PRIMARY,
    },
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
            // size="small"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={textFieldStyles}
          />

          <TextField
            label="Description"
            size="small"
            multiline
            rows={3}
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={textFieldStyles}
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
          variant='contained'
          disabled={!isFormValid}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            borderRadius: '10px',
            bgcolor: BRAND_PRIMARY,
            // color: '#fff',
            '&:hover': { bgcolor: BRAND_PRIMARY_HOVER },
            '&:disabled': { bgcolor: 'rgba(95, 90, 71, 0.3)' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCard;
