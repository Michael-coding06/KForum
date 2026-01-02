import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
} from '@mui/material';
import {
  BRAND_PRIMARY,
  BRAND_PRIMARY_HOVER,
} from '../../components/forum.constants.ts';

interface CreateCardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  setTitle: (value: string) => void;
  details: string;
  setDetails: (value: string) => void;
  isFormValid: boolean;
}

const CreateCard = ({ 
  open, 
  onClose, 
  onSubmit,
  title,
  setTitle,
  details,
  setDetails,
  isFormValid
}: CreateCardProps) => {
  const handleSubmit = () => {
    if (!isFormValid) return;
    onSubmit();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderLeft: `5px solid ${BRAND_PRIMARY_HOVER}`,
          borderRadius: '20px',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Title */}
          <TextField
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                border: `1.5px solid ${BRAND_PRIMARY}`,
                borderRadius: '15px',
                backgroundColor: '#fff',

                '& fieldset': {
                  border: 'none',
                },
              },

              '& .MuiInputBase-input': {
                p: 2,
                fontSize: '1.1rem',
              },
            }}
          />
          {/* Description */}
          <TextField
            placeholder="Details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            multiline
            minRows={4}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                border: `1.5px solid ${BRAND_PRIMARY}`,
                borderRadius: '15px',
                backgroundColor: '#fafafa',

                '& fieldset': {
                  border: 'none',
                },
              },

              '& .MuiInputBase-input': {
                lineHeight: 1.5,
              },
            }}
          />
          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                px: 3,
                color: '#666',
                borderColor: '#d0d0d0',
                '&:hover': {
                  borderColor: '#999',
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isFormValid}
              sx={{
                textTransform: 'none',
                borderRadius: '10px',
                px: 4,
                bgcolor: BRAND_PRIMARY,
                '&:hover': { bgcolor: BRAND_PRIMARY_HOVER },
                '&:disabled': {
                  bgcolor: '#e0e0e0',
                  color: '#999',
                },
              }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCard;