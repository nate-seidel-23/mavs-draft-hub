// components/BigBoard.jsx
import { useMemo, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, Avatar, Typography, Box, TableSortLabel, Divider} from '@mui/material';
import { ArrowDropUp, ArrowDropDown } from '@mui/icons-material';
import { mergePlayerData, getAverageRank } from '../utils/mergeData';
import { formatHeight } from '../utils/format';
import data from '../data/intern_project_data.json';

const scoutList = ["ESPN Rank", "Sam Vecenie Rank", "Kevin O'Connor Rank", "Kyle Boone Rank", "Gary Parrish Rank"];



const getColorIcon = (rank, avg) => {
  if (rank === null || rank === undefined) return null;
  const diff = rank - avg;
  if (diff <= -3) return <ArrowDropUp color="success" />;
  if (diff >= 3) return <ArrowDropDown color="error" />;
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
    <Box sx={{ overflowX: 'auto'}}>
      <Typography variant="h4" fontWeight="bold"  sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
        NBA Draft Hub 2025
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'averageRank'}
                direction={orderBy === 'averageRank' ? order : 'asc'}
                onClick={() => handleSort('averageRank')}>
                Avg Rank
              </TableSortLabel>
            </TableCell>

            <TableCell>Name</TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === 'height'}
                direction={orderBy === 'height' ? order : 'asc'}
                onClick={() => handleSort('height')}>
                Height
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === 'weight'}
                direction={orderBy === 'weight' ? order : 'asc'}
                onClick={() => handleSort('weight')}>
                Weight
              </TableSortLabel>
            </TableCell>

            {scoutList.map(scout => (
              <TableCell key={scout}>
                <TableSortLabel
                  active={orderBy === scout}
                  direction={orderBy === scout ? order : 'asc'}
                  onClick={() => handleSort(scout)}>
                  {scout}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map(player => (
            <TableRow key={player.playerId}>
              <TableCell>
                <Typography fontWeight="bold">{player.averageRank.toFixed(1)}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar src={player.photoUrl} sx={{ width: 40, height: 40, mr: 1 }} />
                  <Typography>{player.name}</Typography>
                </Box>
              </TableCell>
              <TableCell>{formatHeight(player.height)}</TableCell>
              <TableCell>{player.weight} lbs</TableCell>
              {scoutList.map(scout => {
                const rank = player.scoutRankings[scout];
                const icon = getColorIcon(rank, player.averageRank);
                return (
                  <TableCell key={scout}>
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
    </Box>
  );
};

export default BigBoard;
