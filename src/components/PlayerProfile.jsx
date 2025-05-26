import { useParams } from 'react-router-dom';
import {Box, Grid, Typography, Avatar, Paper, Tabs, Tab } from '@mui/material';
import data from '../data/intern_project_data.json';
import { formatHeight } from '../utils/format';
import { useState } from 'react';
import { mergePlayerData } from '../utils/mergeData';
import ScoutIntel from './ScoutIntel';
import Stats from './Stats';
import Measurements from './Measurements';
import Compare from './Compare';


const PlayerProfile = () => {

    const { playerId } = useParams();
    const mergedPlayers = mergePlayerData(data.bio, data.scoutRankings);
    const player = mergedPlayers.find(p => String(p.playerId) === String(playerId));

    if (!player) return <div>Player not found.</div>;

    const allLogs = data.seasonLogs.filter(
        log => String(log.playerId) === String(playerId)
    );

    // Unique leagues for dropdown
    const leagues = Array.from(new Set(allLogs.map(log => log.League)));
    const [selectedLeague, setSelectedLeague] = useState(leagues[0] || '');

    // Filtered logs for the table
    const filteredLogs = allLogs.filter(log => log.League === selectedLeague);

    const [tab, setTab] = useState(0);

    return (
       <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5', py: 4, px: { xs: 2, sm: 4 } }}>

            <Box sx={{ textAlign: 'center'}}>
                <Paper
                    id="player_card"
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mx: 'auto',
                        width: '100%',
                        maxWidth: 700, // Increased for better desktop layout
                    }}
                >

                    <Grid container spacing={2} alignItems="center" justifyContent="center">
  <Grid item xs={12} sm={4}>
    <Avatar
      src={player.photoUrl}
      alt={player.name}
      sx={{ width: 120, height: 120, margin: 'auto' }}
    />
  </Grid>
  <Grid item xs={12} sm={5}>
    <Typography variant="h5" fontWeight="bold">{player.name}</Typography>
    <Typography variant="subtitle1">{player.currentTeam} | {player.league}</Typography>
    <Typography variant="body2" color="text.secondary" mt={1}>
      Birth Date: {player.birthDate} <br/>
      HT/WT: {formatHeight(player.height)}, {player.weight} lbs<br/>
      From: {
        [player.homeTown, player.homeState, player.homeCountry]
          .filter(Boolean)
          .join(', ')
      }<br/>
    </Typography>
  </Grid>
  <Grid item xs={12} sm={3}>
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
         { label: 'PTS', value: allLogs[0]?.PTS ?? '-' },
          { label: 'REB', value: allLogs[0]?.TRB ?? '-' },
          { label: 'AST', value: allLogs[0]?.AST ?? '-' },
          { label: 'FG%', value: allLogs[0]?.['FG%'] ?? '-'}
        ].map((stat, idx) => (
          <Grid item xs={3} key={idx}>
            <Box textAlign="center">
              <Typography variant="caption" color="textSecondary">{stat.label}</Typography>
              <Typography variant="h6">{stat.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  </Grid>
</Grid>
                </Paper>
            </Box>
            <Box sx={{ mt: 2, mb: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary" textColor="primary" 
            variant="scrollable" scrollButtons="auto" >
          <Tab label="Scout Intel" />
          <Tab label="Stats" />
          <Tab label="Measurements" />
          <Tab label="Compare" />
        </Tabs>
      </Box>
      {/* Uniform Paper for all tab content */}
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
