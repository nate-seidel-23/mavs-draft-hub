import React, {useState} from 'react';
import { Paper, Box, Typography, 
            Button, TextField, Dialog, DialogTitle, 
                DialogContent, DialogActions } from '@mui/material';
import data from '../data/intern_project_data.json'

const scoutList = [
  "ESPN Rank",
  "Sam Vecenie Rank",
  "Kevin O'Connor Rank",
  "Kyle Boone Rank",
  "Gary Parrish Rank"
];

const ScoutIntel = ({ player }) => {
    const [reports, setReports] = useState(
        data.scoutingReports
        ? data.scoutingReports.filter(report => report.playerId === player.playerId)
        : []
    );
    const [open, setOpen] = useState(false);
    const [scout, setScout] = useState('');
    const [reportText, setReportText] = useState('');

    const handleAddReport = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setScout('');
        setReportText('');
    };
    const handleSubmit = () => {
        if (!scout.trim() || !reportText.trim()) return;
        setReports([
        ...reports,
        {
            scout,
            report: reportText,
            reportId: Math.random().toString(36).slice(2), // simple unique id
            playerId: player.playerId
        }
        ]);
        handleClose();
    };
  return (
    <>
      <h2>Scout Rankings</h2>
      <Box display="flex" gap={2} flexWrap="wrap" justifyContent={"center"}>
        {scoutList.map(scout => {
          const rank = player.scoutRankings ? player.scoutRankings[scout] : undefined;
          return (
            <Box key={scout} display="flex" alignItems="center">
              <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                {scout}:
              </Typography>
              <Typography variant="body2">
                {rank ?? '—'}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <h2>Scout Reports</h2>
      <Box sx={{
                maxHeight: 300, // adjust as needed
                overflowY: 'auto',
                mb: 2,
                pr: 1
            }}
        >
        {reports.length === 0 ? (
          <Typography variant="body2">No reports available.</Typography>
        ) : (
          reports.map(report => (
            <Box key={report.reportId} sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                {report.scout}
              </Typography>
              <Typography variant="body2">{report.report}</Typography>
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
          />
          <TextField
            margin="dense"
            label="Scout Report"
            fullWidth
            multiline
            minRows={3}
            value={reportText}
            onChange={e => setReportText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ScoutIntel;
