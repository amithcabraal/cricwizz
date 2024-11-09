import { useQuery } from '@tanstack/react-query';
import { fetchLiveMatches } from '../api/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  Alert,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const LiveMatchesList = () => {
  const navigate = useNavigate();
  const { data: matches, isLoading, error } = useQuery<Match[]>({
    queryKey: ['liveMatches'],
    queryFn: fetchLiveMatches,
    refetchInterval: 30000,
    retry: 3
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error" 
        action={
          <Button color="inherit" size="small" onClick={() => window.location.reload()}>
            RETRY
          </Button>
        }
      >
        {error instanceof Error ? error.message : 'Error loading matches'}
      </Alert>
    );
  }

  if (!matches?.length) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No live matches available at the moment
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Teams</TableCell>
            <TableCell>Venue</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.id}>
              <TableCell>
                {match.localteam.name} vs {match.visitorteam.name}
              </TableCell>
              <TableCell>{match.venue?.name || 'TBD'}</TableCell>
              <TableCell>{match.status}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  onClick={() => navigate(`/match/${match.id}`)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};