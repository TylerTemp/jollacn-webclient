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
    article: {
        code: {
            color: '#c7254e',
            backgroundColor: '#f8f8f8',
        }
    }
});
