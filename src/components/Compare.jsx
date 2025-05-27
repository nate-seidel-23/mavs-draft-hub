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

const getColor = (val, compareVal, key, type = 'stat') => {
  if (val == null || compareVal == null) return 'inherit';
  if (val === compareVal) return 'inherit';
  if (type === 'scoutRank') {
    // Lower is better for scout ranks
    return val < compareVal ? 'green' : 'red';
  }
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
const PlayerCompareCard = ({ player, compareTo, tab, showAvatar }) => {
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
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 2,
        minWidth: 0,
        width: '100%',
        position: 'relative',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
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
            ? { paddingRight: '80px' }
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
      {/* --- Scout Rankings --- */}
      {tab === 0 && (
        <Box>
          {Object.entries(ranks).filter(([key]) => key !== 'playerId')
            .map(([key, value], idx) => (
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
                    width: 180,
                    justifyContent: 'center',
                  }}
                >
                  <span style={{
                    fontWeight: 700,
                    color: '#111',
                    textAlign: 'right',
                    display: 'inline-block',
                    width: 120,
                  }}>
                    {`Mavs Scout ${idx + 1}:`}
                  </span>
                  <span style={{
                    color: getColor(value, compareRanks[key], key, 'scoutRank'),
                    fontWeight: 700,
                    marginLeft: 8,
                    textAlign: 'left',
                    display: 'inline-block',
                    width: 32,
                  }}>
                    {value ?? '—'}
                  </span>
                </Box>
              </Box>
            ))}
        </Box>
      )}
      {/* --- Stats --- */}
      {tab === 1 && (
        <Box>
          {statKeys.map(({ key, label }) => (
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
                  width: 180,
                  justifyContent: 'center',
                }}
              >
                <span style={{
                  fontWeight: 700,
                  color: '#111',
                  display: 'inline-block',
                }}>
                  {label}:
                </span>
                <span style={{
                  color: getColor(stats[key], compareStats[key]),
                  fontWeight: 700,
                  marginLeft: 8,
                  display: 'inline-block',
                  minWidth: 32,
                }}>
                  {stats[key] ?? '—'}
                </span>
              </Box>
            </Box>
          ))}
        </Box>
      )}
      {/* --- Measurements --- */}
      {tab === 2 && (
        <Box sx={{ minWidth: 0 }}>
          {measurementKeys.map(({ key }, idx) => (
            <React.Fragment key={key}>
              <Typography
                variant="body2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    color: '#111',
                    minWidth: 140,
                    maxWidth: 140,
                    flexShrink: 0,
                    display: 'inline-block',
                  }}
                >
                  {measurementLabels[key]}:
                </span>
                <span
                  style={{
                    color: getColor(measurements[key], compareMeasurements[key], key),
                    fontWeight: 700,
                    marginLeft: 8,
                    minWidth: 0,
                    wordBreak: 'break-all',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    textAlign: 'right',
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
        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          <Grid sx={{ display: 'flex', flex: 1, minWidth: 0 }} size={{ xs: 12, md: 6 }}>
            <PlayerCompareCard player={player} compareTo={comparePlayer} tab={tab} showAvatar={false} />
          </Grid>
          <Grid sx={{ display: 'flex', flex: 1, minWidth: 0 }} size={{ xs: 12, md: 6 }}>
            <PlayerCompareCard player={comparePlayer} compareTo={player} tab={tab} showAvatar={true} />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body2" color="textSecondary">Select a player to compare.</Typography>
      )}
    </Box>
  );
};

export default Compare;