import { createTheme, themeCommon } from './Basic';

export default createTheme({
    ...themeCommon,

    palette: {
        mode: 'dark',
    },

    // themeBubble: '#fff',
    dim: 'rgba(0, 0, 0, 0.66)',

    article: {
        code: {
            color: 'rgb(251, 121, 154)',
            backgroundColor: 'rgba(255, 255, 255, 0.17)',
        }
    }
});
