import { 
  CardContent, 
  TextField, 
  Box, 
  Button 
} from '@mui/material';
import { useState } from 'react';

interface ReplyProps {
  onReply: (reply: string) => void;
}

const ReplyInputCard = ({onReply}: ReplyProps) => {
  const [reply, setReply] = useState<string>('');
  
  const handleSubmit = () => {
    if (reply.trim()) {
      onReply(reply);
      setReply('');
    }
  }

  return (
    <Box sx ={{
      border: '1px solid #AE887B',
      borderRadius: 5,
      marginBottom: 3,
    }}>
      <CardContent sx={{ py: 1, px: 2}}>
        <TextField
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          fullWidth
          placeholder="Write a reply..."
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button 
            onClick={handleSubmit}
            sx={{
              backgroundColor: '#AE887B',
              color: 'white',
              textTransform: 'none',
              '&:hover': { bgcolor: '#955d14ff' },
              borderRadius: 5
            }}
          >
            Reply
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
};

export default ReplyInputCard;