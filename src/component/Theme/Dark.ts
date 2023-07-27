import { createTheme } from "./Basic";
import { grey } from "@mui/material/colors";

export default createTheme({
    typography: {
        button: {
            textTransform: 'none',
        },
    },

    palette: {
        mode: 'dark',
        // background: {
        //     default: "#222222"
        // },
    },

    themeBubble: grey[300],
    dim: 'rgba(255, 255, 255, 0.2)',
});
