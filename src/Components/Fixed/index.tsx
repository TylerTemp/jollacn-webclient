import Box from "@mui/material/Box";
import Style from "./index.scss";
import { CSSProperties, MouseEventHandler, PropsWithChildren, useEffect } from "react";
import { menuBarHeight as top } from "~/Components/Layouts/MainLayout";


export default ({children, style={}, onClick}: PropsWithChildren<{style?: CSSProperties, onClick?: MouseEventHandler<HTMLDivElement>}>) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    return <Box onClick={onClick} className={Style.fixed} style={{
        top,
        height: `calc(100vh - ${top}px)`,
        ...style}}>
        {children}
    </Box>
}
