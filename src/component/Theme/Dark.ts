import { createTheme } from "./Basic";
import { grey, blue } from "@mui/material/colors";

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
});
