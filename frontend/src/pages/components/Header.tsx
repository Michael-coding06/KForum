import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search } from 'lucide-react';

import { BRAND_PRIMARY } from './forum.constants.ts';
import logo from '../../image/logo.png';

interface HeaderProps {
  username: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  pageType: string;
}

const Header = ({ username, searchTerm, onSearchChange, pageType }: HeaderProps) => {
  return (
    <AppBar sx={{ bgcolor: BRAND_PRIMARY }}>
      <Toolbar>
        <img src={logo} alt="logo" className="logo" />

        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Hi, {username}
        </Typography>

        <Box sx={{ marginLeft: 'auto' }}>
          <TextField
            placeholder= {`Search ${pageType}...`}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;