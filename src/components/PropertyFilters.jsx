import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  InputAdornment,
  Divider,
  Typography,
} from '@mui/material';
import { 
  Clear as ClearIcon,
  LocationOn as LocationIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Bed as BedIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { formatPrice } from '../utils/formatters';

function PropertyFilters({ filters, onFilterChange }) {
  const clearAllFilters = () => {
    onFilterChange('location', '');
    onFilterChange('type', '');
    onFilterChange('maxPrice', '');
    onFilterChange('bedrooms', '');
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      background: 'white',
      borderRadius: 3,
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#60a5fa',
        borderWidth: '2px',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#4a5568',
      fontWeight: 600,
      '&.Mui-focused': {
        color: '#60a5fa',
      },
    },
    '& .MuiInputBase-input': {
      color: '#1a202c',
      fontWeight: 500,
    },
    '& .MuiInputBase-input::placeholder': {
      color: '#a0aec0',
      opacity: 1,
    },
  };

  const selectStyles = {
    ...textFieldStyles,
    '& .MuiSelect-select': {
      color: '#1a202c',
      fontWeight: 500,
    },
    '& .MuiSelect-icon': {
      color: '#4a5568',
    },
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Location"
            placeholder="e.g., New York, NY"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            variant="outlined"
            sx={textFieldStyles}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: '#60a5fa' }} />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={selectStyles}>
            <InputLabel sx={{ color: '#4a5568', fontWeight: 600 }}>
              Property Type
            </InputLabel>
            <Select
              value={filters.type || ''}
              onChange={(e) => onFilterChange('type', e.target.value)}
              label="Property Type"
              startAdornment={
                <InputAdornment position="start">
                  <HomeIcon sx={{ color: '#60a5fa', ml: 1 }} />
                </InputAdornment>
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mt: 1,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  }
                }
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="sale">For Sale</MenuItem>
              <MenuItem value="rent">For Rent</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Max Price"
            type="number"
            placeholder="Enter max price"
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
            variant="outlined"
            sx={textFieldStyles}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: '#60a5fa' }} />
                  </InputAdornment>
                ),
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth variant="outlined" sx={selectStyles}>
            <InputLabel sx={{ color: '#4a5568', fontWeight: 600 }}>
              Min Bedrooms
            </InputLabel>
            <Select
              value={filters.bedrooms || ''}
              onChange={(e) => onFilterChange('bedrooms', e.target.value)}
              label="Min Bedrooms"
              startAdornment={
                <InputAdornment position="start">
                  <BedIcon sx={{ color: '#60a5fa', ml: 1 }} />
                </InputAdornment>
              }
              MenuProps={{
                PaperProps: {
                  sx: {
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    mt: 1,
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  }
                }
              }}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="1">1+ Bedroom</MenuItem>
              <MenuItem value="2">2+ Bedrooms</MenuItem>
              <MenuItem value="3">3+ Bedrooms</MenuItem>
              <MenuItem value="4">4+ Bedrooms</MenuItem>
              <MenuItem value="5">5+ Bedrooms</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Divider sx={{ mb: 3, borderColor: '#e2e8f0' }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          onClick={clearAllFilters}
          startIcon={<ClearIcon />}
          variant="outlined"
          sx={{
            color: '#4a5568',
            borderColor: '#e2e8f0',
            fontWeight: 600,
            fontSize: '0.95rem',
            textTransform: 'none',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            borderWidth: '2px',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: '#cbd5e0',
              borderWidth: '2px',
              background: '#f8fafc',
              transform: 'translateY(-1px)',
            },
          }}
        >
          Clear All Filters
        </Button>
        
        <Button
          startIcon={<SearchIcon />}
          variant="contained"
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: '0.95rem',
            textTransform: 'none',
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(96, 165, 250, 0.6)',
            },
          }}
        >
          Search Properties
        </Button>
      </Box>

      {(filters.location || filters.type || filters.maxPrice || filters.bedrooms) && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#4a5568', fontWeight: 500 }}>
            Active Filters: 
            {filters.location && ` Location: "${filters.location}"`}
            {filters.type && ` • Type: ${filters.type === 'sale' ? 'For Sale' : 'For Rent'}`}
            {filters.maxPrice && ` • Max Price: ${formatPrice(parseInt(filters.maxPrice))}`}
            {filters.bedrooms && ` • ${filters.bedrooms}+ Bedrooms`}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default PropertyFilters;
