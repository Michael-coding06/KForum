import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from '@mui/material';
import { Search, LogOut } from 'lucide-react';
import { BRAND_PRIMARY } from './forum.constants.ts';
import { useNavigate } from 'react-router-dom';
import logo from '../../image/logo.png';

interface HeaderProps {
  username: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageType: string;
}

const Header = ({ 
  username, 
  searchTerm, 
  onSearchChange, 
  pageType
}: HeaderProps) => {
  const navigate = useNavigate();
  return (
    <AppBar sx={{ bgcolor: BRAND_PRIMARY }}>
      <Toolbar>
        <img src={logo} alt="logo" className="logo" 
          style={{ cursor: 'pointer' }}
          onClick = {() => navigate(`/`)}
        />
        
        <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2 }}>
          Hi, {username}
        </Typography>
        
        <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder={`Search ${pageType}...`}
            className="search"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} color={BRAND_PRIMARY} />
                </InputAdornment>
              ),
            }}
          />
          
          <Button
            variant="outlined"
            startIcon={<LogOut size={18} />}
            sx={{
              color: 'white',
              borderColor: 'white',
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Sign Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;