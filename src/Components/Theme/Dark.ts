import { grey } from '@mui/material/colors';
import { createTheme, themeCommon } from './Basic';

export default createTheme({
    ...themeCommon,

    palette: {
        mode: 'dark',
    },

    // themeBubble: '#fff',
    dim: 'rgba(0, 0, 0, 0.66)',
});
