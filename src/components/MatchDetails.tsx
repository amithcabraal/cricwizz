import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMatchDetails } from '../api/client';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Grid,
  Alert,
  CircularProgress,
  Box,
  Button
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: match, isLoading, error } = useQuery<Match, Error>({
    queryKey: ['match', id],
    queryFn: () => fetchMatchDetails(Number(id)),
    refetchInterval: 30000,
    enabled: !!id,
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
          <Button color="inherit" size="small" onClick={() => navigate('/')}>
            BACK TO LIST
          </Button>
        }
      >
        {error.message || 'Error loading match details'}
      </Alert>
    );
  }

  if (!match) {
    return (
      <Alert 
        severity="warning"
        action={
          <Button color="inherit" size="small" onClick={() => navigate('/')}>
            BACK TO LIST
          </Button>
        }
      >
        Match not found
      </Alert>
    );
  }

  const prepareChartData = () => {
    if (!match.balls) return [];
    
    const overData: Record<number, { over: number; runs: number; balls: number[] }> = {};
    match.balls.forEach((ball) => {
      const over = Math.floor(ball.ball);
      if (!overData[over]) {
        overData[over] = { over, runs: 0, balls: [] };
      }
      overData[over].runs += ball.score;
      overData[over].balls.push(ball.score);
    });

    return Object.values(overData);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5">
            {match.localteam.name} vs {match.visitorteam.name}
          </Typography>
          <Typography variant="h6">
            Current Score: {match.runs ?? 0}/{match.wickets ?? 0}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Batting Scorecard</Typography>
          {match.batting?.length ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Batsman</TableCell>
                    <TableCell>Runs</TableCell>
                    <TableCell>Balls</TableCell>
                    <TableCell>4s</TableCell>
                    <TableCell>6s</TableCell>
                    <TableCell>SR</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {match.batting.map((bat) => (
                    <TableRow key={bat.player_id}>
                      <TableCell>{bat.batsman.fullname}</TableCell>
                      <TableCell>{bat.score}</TableCell>
                      <TableCell>{bat.ball}</TableCell>
                      <TableCell>{bat.four_x}</TableCell>
                      <TableCell>{bat.six_x}</TableCell>
                      <TableCell>{bat.rate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No batting data available
            </Typography>
          )}
        </Paper>
      </Grid>

      {match.balls?.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Over by Over Analysis</Typography>
            <BarChart width={800} height={400} data={prepareChartData()}>
              <XAxis dataKey="over" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="runs" fill="#8884d8" name="Runs" />
            </BarChart>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};