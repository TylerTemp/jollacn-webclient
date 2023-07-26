import { createTheme } from "./Basic";
import { grey, blue, yellow } from "@mui/material/colors";

export default createTheme({
    typography: {
        button: {
            textTransform: 'none',
        },
    },

    palette: {
        mode: 'light',
        background: {
            default: "#3a7ba2"
        },
    },

    themeBubble: yellow[400],
});
