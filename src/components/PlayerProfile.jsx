import { useParams, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, Avatar, Paper, Tabs, Tab, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useState } from 'react';
import data from '../data/intern_project_data.json';
import { formatHeight } from '../utils/format';
import { mergePlayerData } from '../utils/mergeData';
import ScoutIntel from './ScoutIntel';
import Stats from './Stats';
import Measurements from './Measurements';
import Compare from './Compare';

const PlayerStatsCard = ({ stats }) => (
  <Paper
    sx={{
      p: 2,
      width: '100%',
      maxWidth: 340,
      mx: { xs: 'auto', sm: 0 },
      mb: { xs: 2, sm: 0 },
      mt: { xs: 2, sm: 0 },
      textAlign: 'center'
    }}
    elevation={2}
  >
    <Typography variant="subtitle2" align="center" gutterBottom>Stats</Typography>
    <Grid container spacing={2} justifyContent="space-between">
      {[
        { label: 'PTS', value: stats.PTS ?? '-' },
        { label: 'REB', value: stats.TRB ?? '-' },
        { label: 'AST', value: stats.AST ?? '-' },
        { label: 'FG%', value: stats['FG%'] ?? '-' }
      ].map((stat, idx) => (
        <Grid size={{xs:3}} key={idx}>
          <Box textAlign="center">
            <Typography variant="caption" color="textSecondary">{stat.label}</Typography>
            <Typography variant="h6">{stat.value}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const mergedPlayers = mergePlayerData(data.bio, data.scoutRankings);
  const player = mergedPlayers.find(p => String(p.playerId) === String(playerId));
  if (!player) return <div>Player not found.</div>;

  const allLogs = data.seasonLogs.filter(log => String(log.playerId) === String(playerId));
  const [tab, setTab] = useState(0);
  const handleTabChange = (_, v) => setTab(v);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4, px: { xs: 2, sm: 4 } }}>
      {/* Back Button and Player Card */}
      <Box sx={{ textAlign: 'center', position: 'relative' }}>
        <Box
          sx={{
            position: 'absolute',
            top: 'env(safe-area-inset-top, 16px)',
            left: 'env(safe-area-inset-left, 16px)',
            zIndex: 2
          }}
        >
          <IconButton aria-label="Go back" onClick={() => navigate('/')} size="large">
            <ArrowBackIosNewIcon />
          </IconButton>
        </Box>
        <Paper
          id="player_card"
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mx: 'auto',
            width: '100%',
            maxWidth: 700,
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
            <Grid sx={{ xs: 12, sm: 4 }}>
              <Avatar
                src={player.photoUrl}
                alt={player.name || 'Player avatar'}
                sx={{ width: 120, height: 120, margin: 'auto' }}
              />
            </Grid>
            <Grid sx={{ xs: 12, sm: 5 }}>
              <Typography variant="h5" fontWeight="bold">{player.name}</Typography>
              <Typography variant="subtitle1">{player.currentTeam} | {player.league}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Birth Date: {player.birthDate} <br />
                HT/WT: {formatHeight(player.height)}, {player.weight} lbs<br />
                From: {
                  [player.homeTown, player.homeState, player.homeCountry]
                    .filter(Boolean)
                    .join(', ')
                }<br />
              </Typography>
            </Grid>
            <Grid sx={{ xs: 12, sm: 3 }}>
              <PlayerStatsCard stats={allLogs[0] || {}} />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Tabs */}
      <Box sx={{ mt: 2, mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
          sx={{
            minHeight: { xs: 36, sm: 48 },
            '& .MuiTab-root': {
              minWidth: { xs: 70, sm: 120 },
              minHeight: { xs: 36, sm: 48 },
              fontSize: { xs: 13, sm: 16 },
              px: { xs: 1, sm: 2 },
            }
          }}
        >
          <Tab label="Scout Intel" />
          <Tab label="Stats" />
          <Tab label="Measurements" />
          <Tab label="Compare" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Paper sx={{ minHeight: 420, width: '100%', maxWidth: 700, mx: 'auto', p: 3 }}>
        {tab === 0 && <ScoutIntel player={player} />}
        {tab === 1 && <Stats player={player} seasonLogs={allLogs} />}
        {tab === 2 && <Measurements player={player} />}
        {tab === 3 && <Compare player={player} />}
      </Paper>
    </Box>
  );
};

export default PlayerProfile;
