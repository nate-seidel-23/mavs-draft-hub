import React, { useState, useMemo } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell, Typography,
  Box, FormControl, InputLabel, Select, MenuItem, Divider
} from '@mui/material';
import data from '../data/intern_project_data.json';
import { useParams } from 'react-router-dom';

const SeasonLogTable = ({ logs }) => (
  <Table
    size="small"
    sx={{
      minWidth: 600,
      '& .MuiTableCell-root': {
        padding: { xs: '6px 6px', sm: '2px 4px' },
        fontSize: '0.95rem',
      },
    }}
  >
    <TableHead>
      <TableRow>
        <TableCell>Season</TableCell>
        <TableCell>Team</TableCell>
        <TableCell align="right">GP</TableCell>
        <TableCell align="right">GS</TableCell>
        <TableCell align="right">MIN</TableCell>
        <TableCell align="right">PTS</TableCell>
        <TableCell align="right">REB</TableCell>
        <TableCell align="right">AST</TableCell>
        <TableCell align="right">FG</TableCell>
        <TableCell align="right">FG%</TableCell>
        <TableCell align="right">3PT</TableCell>
        <TableCell align="right">3P%</TableCell>
        <TableCell align="right">BLK</TableCell>
        <TableCell align="right">STL</TableCell>
        <TableCell align="right">TO</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {logs.map((log, idx) => (
        <TableRow key={idx}>
          <TableCell>{log.Season}</TableCell>
          <TableCell>{log.Team}</TableCell>
          <TableCell align="right">{log.GP}</TableCell>
          <TableCell align="right">{log.GS}</TableCell>
          <TableCell align="right">{log.MP}</TableCell>
          <TableCell align="right">{log.PTS}</TableCell>
          <TableCell align="right">{log.TRB}</TableCell>
          <TableCell align="right">{log.AST}</TableCell>
          <TableCell align="right">{log.FGM}-{log.FGA}</TableCell>
          <TableCell align="right">{log['FG%']}</TableCell>
          <TableCell align="right">{log['3PM']}-{log['3PA']}</TableCell>
          <TableCell align="right">{log['3P%']}</TableCell>
          <TableCell align="right">{log.BLK}</TableCell>
          <TableCell align="right">{log.STL}</TableCell>
          <TableCell align="right">{log.TOV}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const Stats = () => {
  const { playerId } = useParams();

  const allLogs = useMemo(() => {
    return data.seasonLogs.filter(log => String(log.playerId) === String(playerId));
  }, [playerId]);

  const logsByLeague = useMemo(() => {
    return allLogs.reduce((acc, log) => {
      if (!acc[log.League]) acc[log.League] = [];
      acc[log.League].push(log);
      return acc;
    }, {});
  }, [allLogs]);

  const seasonLeagueCombos = useMemo(() => {
    return Array.from(new Set(allLogs.map(log => `${log.Season} - ${log.League}`)));
  }, [allLogs]);

  const [selectedCombo, setSelectedCombo] = useState('All');

  const filteredLogs = useMemo(() => {
    if (selectedCombo === 'All') return allLogs;
    const [season, league] = selectedCombo.split(' - ');
    return allLogs.filter(
      log => String(log.Season) === season && log.League === league
    );
  }, [selectedCombo, allLogs]);

  const filteredGameLogs = useMemo(() => {
    if (selectedCombo === 'All') return [];
    return data.game_logs.filter(
      log =>
        String(log.playerId) === String(playerId) &&
        `${log.season} - ${log.league}` === selectedCombo
    );
  }, [selectedCombo, playerId]);

  return (
    <>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="season-league-select-label">Season</InputLabel>
        <Select
          labelId="season-league-select-label"
          value={selectedCombo}
          label="Season"
          onChange={e => setSelectedCombo(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {seasonLeagueCombos.map(combo => (
            <MenuItem key={combo} value={combo}>{combo}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="h6" gutterBottom>Season Logs</Typography>
      {selectedCombo === 'All' ? (
        Object.entries(logsByLeague).map(([league, logs]) => (
          <Box key={league} sx={{ mb: 1, overflowX: 'auto' }}>
            <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>{league}</Typography>
            <SeasonLogTable logs={logs} />
            <Divider sx={{ mt: 2}} />
          </Box>
        ))
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <SeasonLogTable logs={filteredLogs} />
        </Box>
      )}

      {selectedCombo !== 'All' && (
        <>
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Game Logs</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <Table
              size="small"
              sx={{
                minWidth: 1000,
                '& .MuiTableCell-root': {
                  padding: { xs: '6px 6px', sm: '2px 4px' },
                  fontSize: '0.95rem',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Opponent</TableCell>
                  <TableCell align="right">MIN</TableCell>
                  <TableCell align="right">PTS</TableCell>
                  <TableCell align="right">REB</TableCell>
                  <TableCell align="right">AST</TableCell>
                  <TableCell align="right">FG</TableCell>
                  <TableCell align="right">FG%</TableCell>
                  <TableCell align="right">3PT</TableCell>
                  <TableCell align="right">3P%</TableCell>
                  <TableCell align="right">FT</TableCell>
                  <TableCell align="right">FT%</TableCell>
                  <TableCell align="right">BLK</TableCell>
                  <TableCell align="right">STL</TableCell>
                  <TableCell align="right">TO</TableCell>
                  <TableCell align="right">PF</TableCell>
                  <TableCell align="right">+/-</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredGameLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={17} align="center">No game logs available.</TableCell>
                  </TableRow>
                ) : (
                  filteredGameLogs.map((log, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{log.date?.split(' ')[0]}</TableCell>
                      <TableCell>{log.opponent}</TableCell>
                      <TableCell align="right">{log.timePlayed}</TableCell>
                      <TableCell align="right">{log.pts}</TableCell>
                      <TableCell align="right">{log.reb}</TableCell>
                      <TableCell align="right">{log.ast}</TableCell>
                      <TableCell align="right">{log.fgm}-{log.fga}</TableCell>
                      <TableCell align="right">{log['fg%']}</TableCell>
                      <TableCell align="right">{log.tpm}-{log.tpa}</TableCell>
                      <TableCell align="right">{log['tp%']}</TableCell>
                      <TableCell align="right">{log.ftm}-{log.fta}</TableCell>
                      <TableCell align="right">{log['ft%']}</TableCell>
                      <TableCell align="right">{log.blk}</TableCell>
                      <TableCell align="right">{log.stl}</TableCell>
                      <TableCell align="right">{log.tov}</TableCell>
                      <TableCell align="right">{log.pf}</TableCell>
                      <TableCell align="right">{log.plusMinus}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </>
      )}
    </>
  );
};

export default Stats;
