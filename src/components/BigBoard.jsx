import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Paper, Table, TableHead, TableBody,
  TableRow, TableCell, Avatar, Typography,
  Box, TableSortLabel, Tooltip
} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { mergePlayerData } from '../utils/mergeData';
import { formatHeight } from '../utils/format';
import data from '../data/intern_project_data.json';

const firstWithRankings = data.scoutRankings.find(r => r && typeof r === 'object');
const scoutList = firstWithRankings
  ? Object.keys(firstWithRankings).filter(key => key !== 'playerId')
  : [];

const getColorIcon = (rank, avg) => {
  if (rank === null || rank === undefined) return null;
  const diff = rank - avg;
  if (diff <= -3) {
    return (
      <Tooltip title="This scout is particularly high on this player">
        <ArrowDropUp color="success" />
      </Tooltip>
    );
  }
  if (diff >= 3) {
    return (
      <Tooltip title="This scout is particularly low on this player">
        <ArrowDropDown color="error" />
      </Tooltip>
    );
  }
  return null;
};

const BigBoard = () => {
  const [orderBy, setOrderBy] = useState('averageRank');
  const [order, setOrder] = useState('asc');

  const handleSort = (key) => {
    const isAsc = orderBy === key && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(key);
  };

  const players = useMemo(() => {
    const merged = mergePlayerData(data.bio, data.scoutRankings);
    return merged.sort((a, b) => {
      const aVal = a[orderBy] ?? a.scoutRankings?.[orderBy];
      const bVal = b[orderBy] ?? b.scoutRankings?.[orderBy];

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      return order === 'asc'
        ? aVal - bVal
        : bVal - aVal;
    });
  }, [order, orderBy]);

  return (
    <Paper
      sx={{
        mt: 2,
        mx: { xs: 1, sm: 4, md: 8 },
        overflowX: 'auto',
        width: 'auto',
        maxWidth: '100%',
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'averageRank'}
                direction={orderBy === 'averageRank' ? order : 'asc'}
                onClick={() => handleSort('averageRank')}
              >
                Avg Rank
              </TableSortLabel>
            </TableCell>
            <TableCell
              sx={{
                position: 'sticky',
                left: 0,
                zIndex: 2,
                minWidth: 160,
                backgroundColor: 'background.paper',
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                borderTop: `transparent`,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >Name
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'height'}
                direction={orderBy === 'height' ? order : 'asc'}
                onClick={() => handleSort('height')}
              >
                Height
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'weight'}
                direction={orderBy === 'weight' ? order : 'asc'}
                onClick={() => handleSort('weight')}
              >
                Weight
              </TableSortLabel>
            </TableCell>
            {scoutList.map((_, idx) => (
              <TableCell key={idx}>
                <TableSortLabel
                  active={orderBy === scoutList[idx]}
                  direction={orderBy === scoutList[idx] ? order : 'asc'}
                  onClick={() => handleSort(scoutList[idx])}
                >
                  {`Mavs Scout ${idx + 1}`}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player, idx) => (
            <TableRow 
              key={player.playerId}
              sx={{
                zIndex: 1,
                position: 'relative',
              }}
            >
              <TableCell>
                <Typography fontWeight="bold">{player.averageRank.toFixed(1)}</Typography>
              </TableCell>
              <TableCell 
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  backgroundColor: idx % 2 === 0 ? 'background.paper' : '#f3f4f6',
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar src={player.photoUrl} sx={{ width: 40, height: 40, mr: 1 }} />
                  <Link to={`/player/${player.playerId}`} style={{ textDecoration: 'none' }}>
                    <Typography color="primary">{player.name}</Typography>
                  </Link>
                </Box>
              </TableCell>
              <TableCell>{formatHeight(player.height)}</TableCell>
              <TableCell>{player.weight} lbs</TableCell>
              {scoutList.map((scout, idx) => {
                const rank = player.scoutRankings[scout];
                const icon = getColorIcon(rank, player.averageRank);
                return (
                  <TableCell key={idx}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2">{rank ?? '—'}</Typography>
                      {icon && <Box ml={0.5}>{icon}</Box>}
                    </Box>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default BigBoard;