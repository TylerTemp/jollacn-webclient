import { type TypographyOptions } from "@mui/material/styles/createTypography";
import React from "react";

export { createTheme } from "@mui/material/styles";
// export { ThemeProvider } from "@mui/material/styles";
// export { CssBaseline } from "@mui/material";

export const themeCommon = {
    typography: {
        h1: {
            fontSize: '2.8rem',
        },
        h2: {
            fontSize: '1.8rem',
        },
        h6: {
            fontSize: '1rem',
        },
        button: {
            textTransform: 'none',
        },
    } as TypographyOptions,
}

declare module '@mui/material/styles' {
    interface Theme {
        // themeBubble: React.CSSProperties['color'];
        dim: React.CSSProperties['color'];
        // backgroundColor: React.CSSProperties['color'];
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        // themeBubble: React.CSSProperties['color'];
        dim: React.CSSProperties['color'];
        // backgroundColor: React.CSSProperties['color'];
    }
}
