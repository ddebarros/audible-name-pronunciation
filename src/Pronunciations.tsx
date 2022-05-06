import { Button, styled, TextField, Typography, Paper, Grid } from '@mui/material';
import { Box } from '@mui/system';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { usePronunciationState } from './usePronunciationState';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PronunciationCard from './PronunciationCard';
import NewPronunciationDialog from './NewPronunciationDialog';
import { useMemo, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const filteredPronunciations = useMemo(() => {
    const term = searchTerm?.trim().toLocaleLowerCase() ?? ''
    if (term === '') {
      return pronunciations
    }

    return pronunciations.filter((p) => {
      const soundsLike = p.sounds_like.toLowerCase();
      const name = p.name.toLowerCase();
      return soundsLike.includes(term) || name.includes(term)
    })
  }, [pronunciations, searchTerm]);

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
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder='Search'
        />
      </Paper>
      
      {loadingPronunciations
        ? <PronunciationCardsSkeleton />
        : (<Grid container spacing={2}>
          {filteredPronunciations.map((pronunciation) => {
            return <PronunciationCard onRemove={setPronunciationToDelete} key={pronunciation.uuid} pronunciation={pronunciation} />
          })}
        </Grid>)
      }
    </Box>
  );
};

export default Pronunciations;