import React, { useState } from 'react';
import { Autocomplete, Box, Typography, Grid, TextField, MenuItem, Tabs, Tab, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatHeight } from '../utils/format';
import data from '../data/intern_project_data.json';
import {measurementLabels, lowerIsBetterKeys }from '../constants/measurementLabels';
import Avatar from '@mui/material/Avatar';

// Helper to get measurements for a player
const getMeasurements = (p) =>
    data.measurements.find(m => String(m.playerId) === String(p.playerId));

// Helper to get stats for a player (season averages)
const getStats = (p) =>
    data.seasonLogs.find(s => String(s.playerId) === String(p.playerId));

const getRanks = (p) =>
    data.scoutRankings.find(s => String(s.playerId) === String(p.playerId));


/** Helper to get the leaders for stats, ranks, or measurements.
      Returns an array of indexes of the players with the best value for the given key.
      Used later to highlight the best player in the compare view.
 */
function getWinners(values, key, type = 'stat') {
  // Filter out null/undefined
  const valid = values.map((v, i) => ({ val: v, idx: i })).filter(v => v.val != null);
  if (valid.length === 0) return [];
  let winnerIdxs = [];
  if (type === 'scoutRank' || lowerIsBetterKeys.has(key)) {
    const min = Math.min(...valid.map(v => v.val));
    winnerIdxs = valid.filter(v => v.val === min).map(v => v.idx);
  } else {
    const max = Math.max(...valid.map(v => v.val));
    winnerIdxs = valid.filter(v => v.val === max).map(v => v.idx);
  }
  return winnerIdxs;
}

const statKeys = [
  { key: 'PTS', label: 'PTS' },
  { key: 'TRB', label: 'REB' },
  { key: 'AST', label: 'AST' },
  { key: 'FG%', label: 'FG%' },
  { key: '3P%', label: '3P%' },
  { key: 'STL', label: 'STL' },
  { key: 'BLK', label: 'BLK' }
];

// Player card in compare view
const PlayerCompareCard = ({ player, compareTo, tab, showAvatar }) => {
  const ranks = getRanks(player) || {};
  const stats = getStats(player) || {};
  const measurements = getMeasurements(player) || {};

  const measurementKeys = Object.keys(measurements)
  .filter(key => key !== 'playerId')
  .map(key => ({ key }));

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        minWidth: 200,
        width: '100%', 
        position: 'relative',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      {/* Show avatar in upper right only if showAvatar is true and player.photoUrl exists */}
      {showAvatar && player.photoUrl && (
        <Avatar
          src={player.photoUrl}
          alt={player.name}
          sx={{
            position: 'absolute',
            top: 4,
            right: 12,
            width: 50,
            height: 50,
            boxShadow: 2,
            background: '#eee',
          }}
        />
      )}
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        sx={{
          ...(showAvatar && player.photoUrl
            ? { paddingRight: '64px' }
            : { textAlign: 'center', width: '100%' }
          ),
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'nowrap',
          display: 'block',
        }}
      >
        {player.name}
      </Typography>
      <Box
        sx={{
          borderBottom: '1px solid #e0e0e0',
          my: 2,
          width: '100%',
          maxWidth: showAvatar ? 600 : 340,
          mx: 'auto',
        }}
      />
      {tab === 0 && (
        <Box>
          {Object.entries(ranks).filter(([key]) => key !== 'playerId')
            .map(([key, value], idx) => {
              const values = [value, ...compareTo.map(p => p ? getRanks(p)?.[key] : undefined)];
              const winners = getWinners(values, key, 'scoutRank');
              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      maxWidth: 220,
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#111', display: 'inline-block', marginRight: 8 }}>
                      {`Mavs Scout ${idx + 1}:`}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        display: 'inline-block',
                        minWidth: 32,
                        background: winners.includes(0) ? '#e3f0fc' : undefined,
                        borderRadius: 4,
                        padding: '0 6px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}
                    >
                      {value ?? '—'}
                    </span>
                  </Box>
                </Box>
              );
            })}
        </Box>
      )}
      {tab === 1 && (
        <Box>
          {statKeys.map(({ key, label }) => {
            const values = [stats[key], ...compareTo.map(p => p ? getStats(p)?.[key] : undefined)];
            const winners = getWinners(values, key, 'stat');
            return (
              <Box key={key} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: 220, justifyContent: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#111', display: 'inline-block', marginRight: 8 }}>{label}:</span>
                  <span
                    style={{
                      fontWeight: 700,
                      display: 'inline-block',
                      minWidth: 32,
                      background: winners.includes(0) ? '#e3f0fc' : undefined,
                      borderRadius: 4,
                      padding: '0 6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'right',
                    }}
                  >
                    {stats[key] ?? '—'}
                  </span>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
      {tab === 2 && (
        <Box sx={{ minWidth: 0 }}>
          {measurementKeys.map(({ key }, idx) => {
            const values = [measurements[key], ...compareTo.map(p => p ? getMeasurements(p)?.[key] : undefined)];
            const winners = getWinners(values, key, 'measurement');
            return (
              <React.Fragment key={key}>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                    width: '100%',
                    maxWidth: 340,
                    justifyContent: 'space-between', 
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: '#111',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginRight: 8,
                    }}
                  >
                    {measurementLabels[key]}:
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      display: 'inline-block',
                      minWidth: 32,
                      background: winners.includes(0) ? '#e3f0fc' : undefined,
                      borderRadius: 4,
                      padding: '0 6px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      textAlign: 'right',
                      marginLeft: 'auto', 
                    }}
                  >
                    {['heightNoShoes', 'heightShoes', 'wingspan', 'reach'].includes(key)
                      ? measurements[key] ? formatHeight(measurements[key]) : '—'
                      : measurements[key] ?? '—'}
                  </span>
                </Typography>
                {idx < measurementKeys.length - 1 && (
                  <Box
                    sx={{
                      borderBottom: '1px solid #e0e0e0',
                      my: 1,
                      width: '100%',
                      mx: 'auto',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const Compare = ({ player }) => {
  const otherPlayers = data.bio.filter(p => p.playerId !== player.playerId);
  const [compareId, setCompareId] = useState('');
  const [compareId2, setCompareId2] = useState('');
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [search2, setSearch2] = useState('');
  const comparePlayer = otherPlayers.find(p => String(p.playerId) === String(compareId));
  const comparePlayer2 = otherPlayers.find(p => String(p.playerId) === String(compareId2));

  // Filter autocomplete options to exclude the current player and already selected players
  const filteredPlayers = data.bio.filter(p =>
    p.playerId !== player.playerId &&
    (!compareId2 || p.playerId !== compareId2) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPlayers2 = data.bio.filter(p =>
    p.playerId !== player.playerId &&
    (!compareId || p.playerId !== compareId) &&
    p.name.toLowerCase().includes(search2.toLowerCase())
  );



  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" gutterBottom>Compare With</Typography>
        <Box mb={2} sx={{ maxWidth: 350, width: '100%' }}>
            <Autocomplete
              options={filteredPlayers}
              getOptionLabel={p => p.name}
              value={filteredPlayers.find(p => String(p.playerId) === String(compareId)) || null}
              onChange={(_, newValue) => setCompareId(newValue ? newValue.playerId : '')}
              inputValue={search}
              onInputChange={(_, newInputValue) => setSearch(newInputValue)}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Search and Select Player"
                  size="small"
                  fullWidth
                />
              )}
              renderOption={(props, p) => (
                <MenuItem {...props} key={p.playerId}>
                  <Typography component="span">{p.name}</Typography>
                  <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                    {p.currentTeam} ({p.league})
                  </Typography>
                </MenuItem>
              )}
            />

            </Box>
            <Box mb={2} sx={{ maxWidth: 350, width: '100%' }}>
            <Autocomplete
              options={filteredPlayers2}
              getOptionLabel={p => p.name}
              value={filteredPlayers2.find(p => String(p.playerId) === String(compareId2)) || null}
              onChange={(_, newValue) => setCompareId2(newValue ? newValue.playerId : '')}
              inputValue={search2}
              onInputChange={(_, newInputValue) => setSearch2(newInputValue)}
              slotProps={{
                textField: {
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                },
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Search and Select Player"
                  size="small"
                  fullWidth
                />
              )}
              renderOption={(props, p) => (
                <MenuItem {...props} key={p.playerId}>
                  <Typography component="span">{p.name}</Typography>
                  <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>
                    {p.currentTeam} ({p.league})
                  </Typography>
                </MenuItem>
              )}
            />

            </Box>
      
        <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mb: 2 }}
            variant="scrollable"
            scrollButtons="auto"
            
        >
            <Tab label="Scout Ranks" />
            <Tab label="Stats" />
            <Tab label="Measurements" />
      </Tabs>
      {comparePlayer ? (
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          <Grid item xs={12} md={comparePlayer2 ? 4 : 6} sx={{ display: 'flex' }}>
            <PlayerCompareCard
              player={player}
              compareTo={[comparePlayer, comparePlayer2].filter(Boolean)}
              tab={tab}
              showAvatar={false}
            />
          </Grid>
          <Grid item xs={12} md={comparePlayer2 ? 4 : 6} sx={{ display: 'flex' }}>
            <PlayerCompareCard
              player={comparePlayer}
              compareTo={[player, comparePlayer2].filter(Boolean)}
              tab={tab}
              showAvatar={true}
            />
          </Grid>
          {comparePlayer2 && (
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <PlayerCompareCard
                player={comparePlayer2}
                compareTo={[player, comparePlayer].filter(Boolean)}
                tab={tab}
                showAvatar={true}
              />
            </Grid>
          )}
        </Grid>
      ) : (
        <Typography variant="body2" color="textSecondary">Select a player to compare.</Typography>
      )}
    </Box>
  );
};


export default Compare;