import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import data from '../data/intern_project_data.json';
import { formatHeight } from '../utils/format';
import { useMeasurementsUtils } from '../hooks/useMeasurementsUtils';
import { measurementLabels, lowerIsBetterKeys } from '../constants/measurementLabels';
const { getPercentile, getBarColor } = useMeasurementsUtils();

const LegendBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  gap: theme.spacing(4),
  width: '100%',
  maxWidth: '100%',
  marginLeft: 'auto',
  marginRight: 'auto',
  flexWrap: 'wrap',
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1.5),
    marginBottom: theme.spacing(1.5),
  },
}));

const EXCLUDED_KEYS = ['playerId', 'weight', 'heightNoShoes', 'heightShoes'];

const Measurements = ({ player }) => {
  const measurement = data.measurements
    ? data.measurements.find(m => String(m.playerId) === String(player.playerId))
    : null;
  const allMeasurementKeys = measurement
    ? Object.keys(measurement).filter(k => !EXCLUDED_KEYS.includes(k))
    : [];
  const barWidth = 120;
  const circleWidth = 28;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Measurements
      </Typography>
      {measurement ? (
        <>
          {/* Top measurements */}
          <Box
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              p: 1.5,
              textAlign: 'center',
              background: '#fafafa',
              width: '100%',
              maxWidth: 260,
              mx: 'auto',
              mb: 3,
              fontSize: 15,
            }}
          >
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
              Height (No Shoes): <b>{measurement.heightNoShoes ? formatHeight(measurement.heightNoShoes) : '-'}</b>
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 0.5 }}>
              Height (With Shoes): <b>{measurement.heightShoes ? formatHeight(measurement.heightShoes) : '-'}</b>
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Weight: <b>{measurement.weight ?? '-'}</b> lbs
            </Typography>
          </Box>

          {/* Legend */}
          <LegendBox>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 60,
                  height: 10,
                  borderRadius: 5,
                  background: 'linear-gradient(90deg, #b71c1c 0%, #fff 50%, #388e3c 100%)',
                  border: '1px solid #bbb',
                }}
              />
              <Typography variant="caption" sx={{ color: '#b71c1c', fontWeight: 500 }}>
                Poor
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', fontWeight: 500 }}>
                Avg
              </Typography>
              <Typography variant="caption" sx={{ color: '#388e3c', fontWeight: 500 }}>
                Good
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box
                sx={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: '#eee',
                  border: '2px solid #bbb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 11,
                  color: '#222',
                }}
              >
                %
              </Box>
              <Typography variant="caption" sx={{ color: '#888', whiteSpace: 'nowrap' }}>
                – Percentile
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="caption"
                sx={{ color: 'textPrimary', fontWeight: 700, fontSize: 15 }}
              >
                #
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'textPrimary', whiteSpace: 'nowrap' }}
              >
                – Measurement
              </Typography>
            </Box>
          </LegendBox>

          {/* Percentile Bars */}
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="flex-start"
            sx={{ width: '100%', mx: 'auto' }}
          >
            {allMeasurementKeys.map(key => {
              const value = measurement[key];
              if (value === null || value === undefined) return null;
              let percentile = getPercentile(key, value);
              if (lowerIsBetterKeys.has(key) && percentile !== null) {
                percentile = 100 - percentile;
              }

              const fillWidth = (percentile / 100) * barWidth;
              const circleLeft = Math.min(
                Math.max(fillWidth - circleWidth / 2, 0),
                barWidth - circleWidth
              );

              return (
                <Grid size={{ xs: 12, sm: 4 }} key={key} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: 160,
                      mx: 'auto',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="textSecondary"
                      sx={{ mb: 1, textAlign: 'center', minHeight: 24 }}
                    >
                      {measurementLabels[key] || key}
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        height: 24,
                        width: barWidth,
                        borderRadius: 12,
                        background: '#eee',
                        overflow: 'visible',
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      {/* Colored bar */}
                      {percentile >= 10 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${fillWidth}px`,
                            background: getBarColor(percentile),
                            borderRadius: percentile >= 98 ? '12px' : '12px 0 0 12px',
                            border: percentile > 8 ? '1.5px solid #888' : 'none',
                            transition: 'width 0.3s',
                            zIndex: 1,
                          }}
                        />
                      )}
                      {/* Percentile circle */}
                      {percentile !== null && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: circleLeft,
                            transform: 'translateY(-50%)',
                            width: circleWidth,
                            height: circleWidth,
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
                            boxShadow: '0 0 2px #888',
                          }}
                        >
                          {percentile}
                        </Box>
                      )}
                    </Box>
                    <Typography variant="caption" color="textPrimary" sx={{ fontSize: 15, fontWeight: 500 }}>
                      {(key === 'wingspan' || key === 'reach') ? formatHeight(value) : value}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </>
      ) : (
        <Typography variant="body2">No measurements available.</Typography>
      )}
    </>
  );
};

export default Measurements;