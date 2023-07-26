import { createTheme } from "./Basic";
import { grey, blue } from "@mui/material/colors";

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
});
