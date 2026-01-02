import { useState } from 'react';

import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box 
} from '@mui/material';

import { BRAND_PRIMARY, BRAND_PRIMARY_HOVER, TEXT_FIELD_STYLES } from '../../components/forum.constants.ts';
import {Comment} from '../../../types/Comment.tsx';
interface EditCommentProps {
    comment: Comment;
    open: boolean;
    onClose: () => void;
    onSave: (newComment: string) => void;
    onDelete: (commentID: number) => void;
}

const EditCommment = ({open, onClose, onSave, comment, onDelete} : EditCommentProps) => {
    const [newComment, setNewComment] = useState<string>(comment.Comment || '');
    if (!comment) return null;

    const handleSave = async() => {
        onSave(newComment);
        onClose();
    }

    const handleCancel = () => {
        setNewComment(comment.Comment);
        onClose();
    }

    const handleDelete = async() => {
        onDelete(comment.ID)
        onClose();
    }

    return (
        <Dialog 
            open={open}
            onClose={handleCancel}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { border: `4px solid ${BRAND_PRIMARY_HOVER}` }
            }}
        >
            <DialogContent>
                <TextField 
                    fullWidth
                    label="New Comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={TEXT_FIELD_STYLES}
                />
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
                    sx={{
                        borderColor: 'error.main',
                        '&:hover': {
                        borderColor: 'error.dark',
                        backgroundColor: 'rgba(211, 47, 47, 0.04)',
                        },
                    }}
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
    )
}

export default EditCommment;
