import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BigBoard from './components/BigBoard';
import PlayerProfile from './components/PlayerProfile';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header /> {}
        <Routes>
          <Route path="/" element={<BigBoard />} />
          <Route path="/player/:playerId" element={<PlayerProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
