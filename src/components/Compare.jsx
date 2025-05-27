import React, { useState } from 'react';
import { Autocomplete, Box, Typography, Grid, TextField, MenuItem, Tabs, Tab, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { formatHeight } from '../utils/format';
import data from '../data/intern_project_data.json';
import {measurementLabels, lowerIsBetterKeys }from '../constants/measurementLabels';

// Helper to get measurements for a player
const getMeasurements = (p) =>
    data.measurements.find(m => String(m.playerId) === String(p.playerId));

// Helper to get stats for a player (season averages)
const getStats = (p) =>
    data.seasonLogs.find(s => String(s.playerId) === String(p.playerId));

const getRanks = (p) =>
    data.scoutRankings.find(s => String(s.playerId) === String(p.playerId));

const getColor = (val, compareVal, key) => {
  if (val == null || compareVal == null) return 'inherit';
  if (val === compareVal) return 'inherit';
  const higherIsBetter = !lowerIsBetterKeys.has(key);
  if (higherIsBetter) {
    return val > compareVal ? 'green' : 'red';
  } else {
    return val < compareVal ? 'green' : 'red';
  }
};

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
const PlayerCompareCard = ({ player, compareTo, tab }) => {
  const ranks = getRanks(player) || {};
  const compareRanks = getRanks(compareTo) || {};
  const stats = getStats(player) || {};
  const compareStats = getStats(compareTo) || {};
  const measurements = getMeasurements(player) || {};
  const compareMeasurements = getMeasurements(compareTo) || {};

  const measurementKeys = Object.keys(measurements)
  .filter(key => key !== 'playerId')
  .map(key => ({ key }));

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold">{player.name}</Typography>
      {tab === 0 && (
        <Box>
          {Object.entries(ranks).filter(([key]) => key !== 'playerId')
            .map(([key, value], idx) => (
              <Typography
                key={key}
                variant="body2"
                sx={{ color: getColor(value, compareRanks[key], false) }}
              >
                {`Mavs Scout ${idx + 1}`}: {value ?? '—'}
              </Typography>
            ))}
        </Box>
      )}
      {tab === 1 && (
        <Box>
          {statKeys.map(({ key, label }) => (
            <Typography
              key={key}
              variant="body2"
              sx={{ color: getColor(stats[key], compareStats[key]) }}
            >
              {label}: {stats[key] ?? '—'}
            </Typography>
          ))}
        </Box>
      )}
      {tab === 2 && (
        <Box>
          {measurementKeys.map(({ key }) => (
            <Typography
              key={key}
              variant="body2"
              sx={{ color: getColor(measurements[key], compareMeasurements[key], key) }}
            >
              {measurementLabels[key]}: {['heightNoShoes', 'heightShoes', 'wingspan', 'reach'].includes(key)
                ? measurements[key] ? formatHeight(measurements[key]) : '—'
                : measurements[key] ?? '—'}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

const Compare = ({ player }) => {
  const otherPlayers = data.bio.filter(p => p.playerId !== player.playerId);
  const [compareId, setCompareId] = useState('');
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const comparePlayer = otherPlayers.find(p => String(p.playerId) === String(compareId));

  // Filter players to search
  const filteredPlayers = otherPlayers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
                renderInput={params => (
                <TextField
                    {...params}
                    label="Search and Select Player"
                    size="small"
                    fullWidth
                    InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    }}
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
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={6}>
            <PlayerCompareCard player={player} compareTo={comparePlayer} tab={tab} />
          </Grid>
          <Grid item xs={12} md={6}>
            <PlayerCompareCard player={comparePlayer} compareTo={player} tab={tab} />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" color="textSecondary">Select a player to compare.</Typography>
      )}
    </Box>
  );
};

export default Compare;