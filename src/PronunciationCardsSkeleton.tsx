import { Box, Card, CardActions, CardContent, Divider, Grid, Paper, Skeleton, Typography } from '@mui/material';
import React from 'react';

const CardSkeleton = () => (
  <Card variant='outlined'>
    <CardContent sx={{ display: 'flex', alignItems: 'start' }}>
      <Skeleton sx={{ borderRadius: 2, flexShrink: 0 }} variant="rectangular" width={56} height={56} />
      <Box width="100%" sx={{ ml: 1 }}>
        <Skeleton variant='text' width="80%" height={30} />
        <Skeleton variant='text' width="80%" />
      </Box>
    </CardContent>
    <Divider />
    <CardActions sx={{ justifyContent: 'flex-end' }}>
      <Skeleton variant='text' width={30} height={30} />
      <Skeleton variant='text' width={30} height={30} />
    </CardActions>
  </Card>
)
const PronunciationCardsSkeleton = () => {
  return (
    <Grid container spacing={2}>
      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>

      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>

      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>

      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>

      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>

      <Grid item md={6} xs={12}>
        <CardSkeleton />
      </Grid>
    </Grid>
  );
};

export default PronunciationCardsSkeleton;