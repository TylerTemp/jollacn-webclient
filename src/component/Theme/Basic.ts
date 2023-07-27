import React from "react";

export { createTheme } from "@mui/material/styles";
// export { ThemeProvider } from "@mui/material/styles";
// export { CssBaseline } from "@mui/material";

declare module '@mui/material/styles' {
    interface Theme {
        themeBubble: React.CSSProperties['color'];
        dim: React.CSSProperties['color'];
        // backgroundColor: React.CSSProperties['color'];
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        themeBubble: React.CSSProperties['color'];
        dim: React.CSSProperties['color'];
        // backgroundColor: React.CSSProperties['color'];
    }
}
