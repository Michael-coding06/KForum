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
import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER, TEXT_FIELD_STYLES } from './forum.constants.ts';

interface CreateCardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

const CreateCard = ({ open, onClose, onSubmit }: CreateCardProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const isFormValid = Boolean(title.trim() && description.trim());

  const resetForm = () => {
    setTitle('');
    setDescription('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit(title, description);
    resetForm();
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
          p: 1,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: BRAND_PRIMARY, fontSize: '1.5rem' }}>
          Create New Topic
        </DialogTitle>
        <IconButton onClick={handleClose} sx={{ mr: 2 }}>
          <X size={24} color={BRAND_PRIMARY} />
        </IconButton>
      </Box>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
          <TextField
            label="Title"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter topic title..."
            sx={TEXT_FIELD_STYLES}
          />
          <TextField
            label="Description"
            required
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter topic description..."
            sx={TEXT_FIELD_STYLES}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: BRAND_PRIMARY,
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(95, 90, 71, 0.08)' },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isFormValid}
          sx={{
            bgcolor: BRAND_PRIMARY,
            textTransform: 'none',
            borderRadius: '10px',
            px: 3,
            '&:hover': { bgcolor: BRAND_PRIMARY_HOVER },
            '&:disabled': { bgcolor: 'rgba(95, 90, 71, 0.3)' },
          }}
        >
          Create Topic
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCard;