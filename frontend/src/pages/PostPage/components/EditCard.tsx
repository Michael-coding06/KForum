import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';

import {
  BRAND_PRIMARY,
  BRAND_PRIMARY_HOVER,
  TEXT_FIELD_STYLES,
} from '../../components/forum.constants.ts';

import { Post } from '../../../types/Post.tsx';
import useDeletePost from '../../../hooks/api/post/useDeletePost.tsx';

interface EditCardProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  onSave: (newTitle: string, newDetails: string) => Promise<void> | void;
}

const EditCard = ({ post, open, onClose, onSave }: EditCardProps) => {
  const navigate = useNavigate();
  const { postDelete } = useDeletePost();
  const [title, setTitle] = useState<string>('');
  const [details, setDetails] = useState<string>('');

  useEffect(() => {
    if (post && open) {
      setTitle(post.Title);
      setDetails(post.Details);
    }
  }, [post, open]);

  if (!post) return null;

  const handleSave = async () => {
    await onSave(title, details);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = async () => {
    await postDelete(post.ID);
    navigate(-1);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { border: `4px solid ${BRAND_PRIMARY_HOVER}` },
      }}
    >
      <DialogTitle sx={{ px: 3, pt: 3, pb: 1 }}>
        <Typography sx={{ color: '#955d14ff', fontWeight: 600 }}>
          K/{post.CreatedBy}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={TEXT_FIELD_STYLES}
          />

          <TextField
            fullWidth
            label="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            rows={6}
            sx={TEXT_FIELD_STYLES}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          pb: 3,
          pt: 2,
        }}
      >
        <Button
          onClick={handleDelete}
          variant="outlined"
          color="error"
        >
          Delete
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            onClick={handleCancel}
            variant="outlined"
            sx={{
              color: BRAND_PRIMARY,
              borderColor: BRAND_PRIMARY,
              '&:hover': {
                borderColor: BRAND_PRIMARY_HOVER,
                backgroundColor: 'rgba(149, 93, 20, 0.04)',
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: BRAND_PRIMARY,
              '&:hover': {
                backgroundColor: BRAND_PRIMARY_HOVER,
              },
            }}
          >
            Save
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditCard;
