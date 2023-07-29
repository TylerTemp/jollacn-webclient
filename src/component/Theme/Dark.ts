import { createTheme, themeCommon } from "./Basic";
import { grey } from "@mui/material/colors";

export default createTheme({
    ...themeCommon,

    palette: {
        mode: 'dark',
    },

    themeBubble: grey[300],
    dim: 'rgba(0, 0, 0, 0.66)',
});
