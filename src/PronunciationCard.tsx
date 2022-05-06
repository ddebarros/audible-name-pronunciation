import { Button, Card, CardContent, Typography, Grid, Avatar, Divider, CardActions, IconButton, LinearProgress, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import { useState, createRef, useEffect, useRef } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PronunciationSpec } from './usePronunciationState';

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

interface PronunciationCardProps {
  pronunciation: PronunciationSpec;
  onRemove: (uuid: string) => void
}
const PronunciationCard = ({ pronunciation, onRemove }: PronunciationCardProps) => {
  const audioElementRef = createRef<HTMLAudioElement>()
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const onPlay = () => {
    audioElementRef.current?.play();
    setIsPlaying(true);
  }

  const onPause = () => {
    audioElementRef.current?.pause();
    audioElementRef.current?.load();
    setProgress(0);
    setIsPlaying(false);
  }

  useEffect(() => {
    audioElementRef.current?.addEventListener('pause', onPause);
    audioElementRef.current?.addEventListener('ended', onPause);

    const onTimeupdate = (event: Event) => {
      const current = (event?.target as HTMLAudioElement).currentTime ?? 0;
      const duration = (event?.target as HTMLAudioElement).duration ?? 0;
      const percentage = (current / duration) * 100;
      setProgress(percentage);
    };

    audioElementRef.current?.addEventListener('timeupdate', onTimeupdate)

    return () => {
      audioElementRef.current?.removeEventListener('pause', onPause);
      audioElementRef.current?.removeEventListener('ended', onPause);
      audioElementRef.current?.removeEventListener('timeupdate', onTimeupdate)
    }
  }, [audioElementRef.current]);

  return (
    <Grid item md={6} xs={12}>
      <Card variant='outlined'>
        {isPlaying && <LinearProgress variant="determinate" value={progress} />}
        <CardContent sx={{ display: 'flex', alignItems: 'start' }}>
          <Avatar
            variant='rounded'
            alt={pronunciation.name}
            src={pronunciation.image_path}
            sx={{ width: 56, height: 56 }}
          />
          <Box sx={{ ml: 1 }}>
            <Typography variant='subtitle1'>
              <strong>{pronunciation.name}</strong>
            </Typography>
            <Typography variant='subtitle2'>
              {pronunciation.sounds_like}
            </Typography>
          </Box>

          <Box sx={{ ml: 'auto' }}>
            <IconButton disabled={!pronunciation.audio_path} onClick={() => !isPlaying ? onPlay() : onPause()} size='large' aria-label="play">
              {isPlaying ? <PauseCircleOutlineOutlinedIcon /> : <PlayCircleOutlinedIcon />}
            </IconButton>
            <audio ref={audioElementRef} src={pronunciation.audio_path} />
          </Box>
        </CardContent>

        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Tooltip title="Copy Audio URL">
            <IconButton onClick={() => copyToClipboard(pronunciation.audio_path ?? '')} size='small' >
              <ContentCopyIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onRemove(pronunciation.uuid)} size='small' color='error'>
              <DeleteOutlineOutlinedIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Grid>
  );
};

export default PronunciationCard;