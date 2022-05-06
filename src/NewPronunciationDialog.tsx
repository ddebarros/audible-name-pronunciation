import { createRef, FormEventHandler, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Badge, Box, Divider, IconButton, styled, Typography } from '@mui/material';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import useRecorder from './useRecorder';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { UsePronunciationStateResponse } from './usePronunciationState';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const Input = styled('input')({
  display: 'none',
});

interface NewPronunciationDialogProps {
  setOpened: (opened: boolean) => void;
  isOpened: boolean;
  addPronunciation: UsePronunciationStateResponse['addPronunciation'];
}

export default function NewPronunciationDialog({ setOpened, isOpened, addPronunciation }: NewPronunciationDialogProps) {
  const audioRef = createRef<HTMLAudioElement>();
  const formRef = createRef<HTMLFormElement>();
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [image, setImage] = useState<string | undefined>();

  const { startRecording, saveRecording, recorderState, cancelRecording } = useRecorder();

  const handleClose = () => {
    formRef.current?.reset()
    setImage(undefined);
    cancelRecording()
    setOpened(false)
  };

  const onDeleteRecording = () => {
    audioRef.current?.setAttribute('src', '');
    cancelRecording()
  }

  const onImageChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url)
    }
  }

  const onFormSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    const name = (event.target as any)?.name?.value;
    const soundsLike = (event.target as any)?.sounds_like?.value;
    const secret = (event.target as any)?.secret.value;
    const profileImage = (event.target as any)?.profile_image?.files?.[0] as File;

    try {
      await addPronunciation({
        name,
        soundsLike,
        secret,
        image: profileImage,
        audio: recorderState.blob ?? undefined,
      });
      setIsSaving(false);
      handleClose()
    } catch (error) {
      window.alert('There was an error adding new pronunciation');
      setIsSaving(false);
    } 
  }

  return (
    <Dialog open={isOpened} onClose={handleClose}>
      <form ref={formRef} onSubmit={onFormSubmit}>
        <DialogTitle>New Pronunciation</DialogTitle>
        <Divider />
        <DialogContent sx={{ minWidth: '500px' }}>
          <Box sx={{ mb: 4, mt: 1 }}>
            <Badge
              overlap='rectangular'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <label htmlFor="profile_image">
                  <Input onChange={onImageChange} accept="image/*" id="profile_image" type="file" />
                  <IconButton aria-label="upload picture" component="span">
                    <AddCircleRoundedIcon color='disabled' />
                  </IconButton>
                </label>
              }
            >
              <Avatar src={image} sx={{ width: 56, height: 56 }} variant='rounded' />
            </Badge>
          </Box>
          <TextField
            sx={{ width: '400px' }}
            id="name"
            label="Name"
            variant="outlined"
            autoComplete={'off'}
            required={true}
          />

          <TextField
            margin='normal'
            sx={{ width: '400px' }}
            id="sounds_like"
            label="Sounds Like"
            variant="outlined"
            autoComplete={'off'}
            required={true}
          />

          <Box mb={3} mt={3} flexDirection='column' display='flex'>
            <Typography gutterBottom={true} variant='subtitle2' >Audio Recording</Typography>
            <Typography gutterBottom={true} variant='caption'>An optional 5 sec recording of how you pronounce your name</Typography>
            <audio ref={audioRef} controls src={recorderState.audio ?? undefined}></audio>
            <Box mt={1}>
              {recorderState.initRecording
                ? <Button startIcon={<StopCircleOutlinedIcon />} color='error' variant='outlined' size='small' onClick={saveRecording}>stop ({recorderState.recordingSeconds}sec)</Button>
                : <Button startIcon={<RadioButtonCheckedOutlinedIcon />} variant='outlined' size='small' onClick={startRecording}>start</Button>
              }
              {!!recorderState.audio && <Button sx={{ ml: 1 }} startIcon={<DeleteOutlineOutlinedIcon />} variant='outlined' size='small' color='error' onClick={onDeleteRecording}>remove</Button>}
            </Box>
          </Box>

          <Box>
            <TextField
              FormHelperTextProps={{
                sx: { marginLeft: 0 }
              }}
              helperText="Required to remove this pronunciation in the future."
              margin='normal'
              sx={{ width: '400px' }}
              id="secret"
              label="Secret"
              variant="outlined"
              required={true}
              type='password'
              autoComplete={'off'}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant='outlined' disabled={isSaving} onClick={handleClose}>Cancel</Button>
          <LoadingButton variant='contained' endIcon={<SaveOutlinedIcon />} loading={isSaving} loadingPosition="end" type='submit'>Add</LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}