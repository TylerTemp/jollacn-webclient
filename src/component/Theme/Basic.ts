import React from "react";

export { createTheme } from "@mui/material/styles";
// export { ThemeProvider } from "@mui/material/styles";
// export { CssBaseline } from "@mui/material";

declare module '@mui/material/styles' {
    interface Theme {
        // backgroundColor: React.CSSProperties['color'];
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        // backgroundColor: React.CSSProperties['color'];
    }
}
