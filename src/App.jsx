import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BigBoard from './components/BigBoard';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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
        <Routes>
          <Route path="/" element={<BigBoard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
