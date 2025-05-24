import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => (
  <AppBar position="static">
    
    <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <img src="/mavs-logo.png" alt="Mavs Logo" style={{ height: 40, marginRight: 16 }} />
      </Link>
      <Typography variant="h6" component="div">
        Mavs Draft Hub
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;

