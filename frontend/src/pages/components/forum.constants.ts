export const BRAND_PRIMARY = '#5f5a47';
export const BRAND_PRIMARY_HOVER = '#4e4939';
export const STATUS_NONE = '#cdd7eaff';

export const LABEL_COLORS: Record<string, string> = {
  created: BRAND_PRIMARY,
  none: STATUS_NONE,
};

export const TEXT_FIELD_STYLES = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': { borderColor: BRAND_PRIMARY },
    '&.Mui-focused fieldset': { borderColor: BRAND_PRIMARY },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: BRAND_PRIMARY,
  },
};

export const PRIMARY_BUTTON_STYLES = {
  bgcolor: BRAND_PRIMARY,
  textTransform: 'none',
  borderRadius: '10px',
  px: 3,
  '&:hover': { bgcolor: BRAND_PRIMARY_HOVER },
  '&:disabled': { bgcolor: 'rgba(95, 90, 71, 0.3)' },
};

export const SECONDARY_BUTTON_STYLES = {
  color: BRAND_PRIMARY,
  textTransform: 'none',
  '&:hover': { bgcolor: 'rgba(95, 90, 71, 0.08)' },
};