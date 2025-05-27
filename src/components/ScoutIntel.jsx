import React, { useState } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select,
  MenuItem, Snackbar, Alert, Slider
} from '@mui/material';
import PropTypes from 'prop-types';
import data from '../data/intern_project_data.json';

const categories = ["Strength", "Weakness", "Projection", "Other"];

const ScoutIntel = ({ player }) => {
  const [reports, setReports] = useState(
    data.scoutingReports?.filter(report => report.playerId === player.playerId) || []
  );
  const [open, setOpen] = useState(false);
  const [scout, setScout] = useState('');
  const [reportText, setReportText] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [scoutError, setScoutError] = useState(false);
  const [reportTextError, setReportTextError] = useState(false);
  const [categoryError, setCategoryError] = useState(false);

  const handleAddReport = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setScout('');
    setReportText('');
    setCategory('');
    setRating(5);
    setScoutError(false);
    setReportTextError(false);
    setCategoryError(false);
  };
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSubmit = () => {
    const hasScout = !!scout.trim();
    const hasReport = !!reportText.trim();
    const hasCategory = !!category;
    setScoutError(!hasScout);
    setReportTextError(!hasReport);
    setCategoryError(!hasCategory);
    if (!hasScout || !hasReport || !hasCategory) return;
    setReports([
      ...reports,
      {
        scout,
        report: reportText,
        reportId: Math.random().toString(36).slice(2),
        playerId: player.playerId,
        category,
        rating
      }
    ]);
    setSnackbarOpen(true);
    setTimeout(() => {
      const container = document.getElementById('scout-reports-list');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
    handleClose();
  };

  const rankingObj = player.scoutRankings || {};
  const scoutRankingKeys = Object.keys(rankingObj).filter(key => key !== 'playerId');

  return (
    <>
      <Typography variant="h5" gutterBottom>Scout Rankings</Typography>
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
        {scoutRankingKeys.map((key, idx) => (
          <Box key={key} display="flex" alignItems="center">
            <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
              {`Mavericks Scout ${idx + 1}`}:
            </Typography>
            <Typography variant="body2">
              {rankingObj[key] ?? '—'}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Scout Reports</Typography>
      <Box
        id="scout-reports-list"
        sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, pr: 1 }}
      >
        {reports.length === 0 ? (
          <Typography variant="body2">No reports available.</Typography>
        ) : (
          reports.map(report => (
            <Box key={report.reportId} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {report.scout}
                {report.category && (
                  <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                    [{report.category}]
                  </Typography>
                )}
                {typeof report.rating === 'number' && (
                  <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.main' }}>
                    Rating: {report.rating}/10
                  </Typography>
                )}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word',
                }}
              >
                {report.report}
              </Typography>
            </Box>
          ))
        )}
      </Box>
      <Box mt={3} mb={1}>
        <Button variant="contained" onClick={handleAddReport}>Add Report</Button>
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Scout Report</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            fullWidth
            value={scout}
            onChange={e => setScout(e.target.value)}
            error={scoutError}
            helperText={scoutError ? "Name is required" : ""}
          />
          <FormControl fullWidth sx={{ mt: 2 }} error={categoryError}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            {categoryError && (
              <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                Category is required
              </Typography>
            )}
          </FormControl>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Rating</Typography>
            <Slider
              value={rating}
              onChange={(_, val) => setRating(val)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <TextField
            margin="dense"
            label="Scout Report"
            fullWidth
            multiline
            minRows={3}
            value={reportText}
            onChange={e => setReportText(e.target.value)}
            error={reportTextError}
            helperText={reportTextError ? "Report is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Scout report added!
        </Alert>
      </Snackbar>
    </>
  );
};

ScoutIntel.propTypes = {
  player: PropTypes.object.isRequired
};

export default ScoutIntel;
