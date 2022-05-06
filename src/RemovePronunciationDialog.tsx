import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, DialogContent, DialogContentText, Divider, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { createRef, FormEventHandler, useState } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { UsePronunciationStateResponse } from './usePronunciationState';

interface RemovePronunciationDialogProps {
  isOpened: boolean;
  onClose: (opened: boolean) => void;
  removePronunciation: UsePronunciationStateResponse['removePronunciation'];
  pronunciation?: string
};

const RemovePronunciationDialog = ({ isOpened, onClose, removePronunciation, pronunciation }: RemovePronunciationDialogProps) => {
  const formRef = createRef<HTMLFormElement>();
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const handleClose = () => {
    formRef.current?.reset();
    onClose(false)
  }

  const onFormSubmit: FormEventHandler = async (event) => {
    const secret = (event.target as any)?.secret.value;
    if (!secret || !pronunciation) {
      return
    }

    event.preventDefault();
    setIsDeleting(true);

    try {
      await removePronunciation(pronunciation, secret)
      setIsDeleting(false);
      handleClose()
    } catch (error) {
      setIsDeleting(false);
      window.alert('Unable to remove pronunciation')
    }
  }

  return (
    <Dialog open={isOpened} onClose={handleClose}>
      <form ref={formRef} onSubmit={onFormSubmit}>
        <DialogTitle>Remove Pronunciation</DialogTitle>
        <Divider />

        <DialogContent>
          <DialogContentText>
            Please enter the same password used when creating this pronunciation.
          </DialogContentText>
          <Box mt={3}>
            <TextField
              sx={{ width: '400px' }}
              id="secret"
              label="Password"
              variant="outlined"
              autoComplete={'off'}
              type="password"
              required={true}
            />
          </Box>

        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant='outlined' disabled={isDeleting} onClick={handleClose}>Cancel</Button>
          <LoadingButton color='error' variant='contained' endIcon={<DeleteOutlineOutlinedIcon />} loading={isDeleting} loadingPosition="end" type='submit'>Remove</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RemovePronunciationDialog;