import { Button, styled, TextField, Typography, Paper, Grid } from '@mui/material';
import { Box } from '@mui/system';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { usePronunciationState } from './usePronunciationState';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PronunciationCard from './PronunciationCard';
import NewPronunciationDialog from './NewPronunciationDialog';
import { useState } from 'react';
import RemovePronunciationDialog from './RemovePronunciationDialog';
import PronunciationCardsSkeleton from './PronunciationCardsSkeleton';

const Header = styled(Box)`
  padding: 100px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Pronunciations = () => {
  const { pronunciations, loadingPronunciations, addPronunciation, removePronunciation } = usePronunciationState();
  const [isAddModalOpened, setAddModalOpen] = useState<boolean>(false);
  const [pronunciationToDelete, setPronunciationToDelete] = useState<string | undefined>(undefined);

  return (
    <Box sx={{ height: '100vh' }} >
      <NewPronunciationDialog isOpened={isAddModalOpened} setOpened={setAddModalOpen} addPronunciation={addPronunciation} />
      <RemovePronunciationDialog pronunciation={pronunciationToDelete} removePronunciation={removePronunciation} isOpened={!!pronunciationToDelete} onClose={() => setPronunciationToDelete(undefined)} />
      <Header sx={{ padding: '100px 0 50px' }} component='header'>
        <Typography variant='h4'>Name Pronunciations</Typography>
        <Box>
          <Button onClick={() => setAddModalOpen(true)} startIcon={<AddRoundedIcon />} variant='contained'>Add New</Button>
        </Box>
      </Header>

      <Paper variant="outlined" sx={{ mb: 4, padding: '16px' }} component='form'>
        <TextField
          sx={{ width: '400px' }}
          InputProps={{
            startAdornment: <SearchOutlinedIcon color='disabled' />
          }}
          placeholder='Search'
        />
      </Paper>
      
      {loadingPronunciations
        ? <PronunciationCardsSkeleton />
        : (<Grid container spacing={2}>
          {pronunciations.map((pronunciation) => {
            return <PronunciationCard onRemove={setPronunciationToDelete} key={pronunciation.uuid} pronunciation={pronunciation} />
          })}
        </Grid>)
      }
    </Box>
  );
};

export default Pronunciations;