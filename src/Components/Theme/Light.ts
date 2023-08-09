import { yellow } from '@mui/material/colors';
import { createTheme, themeCommon } from './Basic';

export default createTheme({
    ...themeCommon,

    palette: {
        mode: 'light',
        background: {
            default: '#3a7ba2',
        },
    },

    // themeBubble: yellow[400],
    dim: '#24242482',
});
