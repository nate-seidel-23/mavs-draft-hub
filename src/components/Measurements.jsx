import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import data from '../data/intern_project_data.json';
import { formatHeight } from '../utils/format';

// List of measurements to show as bars (exclude height/weight)
const barKeys = [
  'wingspan', 'reach', 'maxVertical', 'noStepVertical', 'bodyFat',
  'handLength', 'handWidth', 'agility', 'sprint',
  'shuttleLeft', 'shuttleRight', 'shuttleBest'
];

const measurementLabels = {
  heightNoShoes: "Height (No Shoes)",
  heightShoes: "Height (With Shoes)",
  weight: "Weight",
  wingspan: "Wingspan",
  reach: "Standing Reach",
  maxVertical: "Max Vertical",
  noStepVertical: "No-Step Vertical",
  bodyFat: "Body Fat %",
  handLength: "Hand Length",
  handWidth: "Hand Width",
  agility: "Lane Agility",
  sprint: "3/4 Court Sprint",
  shuttleLeft: "Shuttle Left",
  shuttleRight: "Shuttle Right",
  shuttleBest: "Shuttle Best"
};

// Helper to calculate percentile
function getPercentile(key, value) {
  const values = data.measurements
    .map(m => m[key])
    .filter(v => v !== null && v !== undefined)
    .sort((a, b) => a - b);
  if (!values.length || value == null) return null;
  const rank = values.findIndex(v => value <= v);
  const percentile = rank === -1
    ? 100
    : Math.round((rank / values.length) * 100);
  return percentile;
}

// Helper to get bar color (blue for low, red for high)
function getBarColor(percentile) {
  // Blue: #1565c0, White: #fff, Red: #b71c1c
  if (percentile <= 50) {
    // Interpolate blue to white
    const t = percentile / 50;
    const r = Math.round(21 + (255 - 21) * t);
    const g = Math.round(101 + (255 - 101) * t);
    const b = Math.round(192 + (255 - 192) * t);
    return `rgb(${r},${g},${b})`;
  } else {
    // Interpolate white to red
    const t = (percentile - 50) / 50;
    const r = Math.round(255 + (183 - 255) * t);
    const g = Math.round(255 + (28 - 255) * t);
    const b = Math.round(255 + (28 - 255) * t);
    return `rgb(${r},${g},${b})`;
  }
}

const Measurements = ({ player }) => {
  const measurement = data.measurements
    ? data.measurements.find(m => String(m.playerId) === String(player.playerId))
    : null;

  return (
    <Paper sx={{ p: 3, mt: 4, mx: 5 }}>
      <Typography variant="h6" gutterBottom>Measurements</Typography>
      {measurement ? (
        <>
          {/* Top 3 measurements in a horizontal row */}
          <Grid container spacing={2} direction="row" justifyContent="center" alignItems="stretch" sx={{ mb: 3 }}>
            {['heightNoShoes', 'heightShoes', 'weight'].map(key => (
              measurement[key] !== null && measurement[key] !== undefined && (
                <Grid item xs={12} sm={4} md={3} key={key}>
                  <Box sx={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 2,
                    p: 2,
                    textAlign: 'center',
                    background: '#fafafa',
                    height: '100%',
                    minWidth: 120,
                  }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {measurementLabels[key]}
                    </Typography>
                    <Typography variant="h6">
                      {key.includes('height')
                        ? formatHeight(measurement[key])
                        : measurement[key]}
                    </Typography>
                  </Box>
                </Grid>
              )
            ))}
          </Grid>

          {/* Key/Legend above percentile bars */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 2, 
            gap: 4, 
            width: 350, 
            mx: 'auto' 
          }}>
            {/* Gradient bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 60, height: 10, borderRadius: 5,
                background: 'linear-gradient(90deg, #1565c0 0%, #fff 50%, #b71c1c 100%)',
                border: '1px solid #bbb'
              }} />
              <Typography variant="caption" sx={{ color: '#1565c0', fontWeight: 500 }}>Poor</Typography>
              <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>Avg</Typography>
              <Typography variant="caption" sx={{ color: '#b71c1c', fontWeight: 500 }}>Good</Typography>
            </Box>
            {/* Percentile circle indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{
                width: 18, height: 18, borderRadius: '50%',
                background: '#eee', border: '2px solid #bbb',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 11, color: '#222'
              }}>%</Box>
              <Typography variant="caption" sx={{ color: '#888' }}>Percentile</Typography>
            </Box>
          </Box>

          {/* Percentile Bars, centered */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            {barKeys.map(key => {
              const value = measurement[key];
              if (value === null || value === undefined) return null;
              const percentile = getPercentile(key, value);
              const circleLeft = percentile === 0
                ? 0
                : `calc(${percentile}% - 14px)`;

              return (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: 350,
                    mx: 'auto',
                    mb: 1.2
                  }}
                >
                  {/* Label left */}
                  <Typography
                    variant="subtitle2"
                    color="textSecondary"
                    sx={{ width: 110, textAlign: 'right', pr: 2, flexShrink: 0 }}
                  >
                    {measurementLabels[key]}
                  </Typography>
                  {/* Bar with percentile circle at the end */}
                  <Box
                    sx={{
                      position: 'relative',
                      height: 24,
                      width: 120,
                      borderRadius: 12,
                      background: '#eee',
                      overflow: 'visible', // allow circle to overflow
                      display: 'flex',
                      alignItems: 'center',
                      mr: 2
                    }}
                  >
                    {/* Colored bar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: `${percentile}%`,
                        background: getBarColor(percentile),
                        borderRadius: 12,
                        border: percentile > 0 ? '1.5px solid #888' : 'none', // Only show border if width > 0
                        transition: 'width 0.3s',
                        zIndex: 1
                      }}
                    />
                    {/* Percentile circle at the end of the colored bar */}
                    {percentile !== null && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: circleLeft,
                          transform: 'translateY(-50%)',
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          background: getBarColor(percentile),
                          border: '3px solid #fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 15,
                          color: '#222',
                          zIndex: 2,
                          boxShadow: '0 0 2px #888'
                        }}
                      >
                        {percentile}
                      </Box>
                    )}
                  </Box>
                  {/* Value right */}
                  <Typography variant="caption" color="textSecondary" sx={{ ml: 1, fontSize: 15 }}>
                    {value}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </>
      ) : (
        <Typography variant="body2">No measurements available.</Typography>
      )}
    </Paper>
  );
};

export default Measurements;