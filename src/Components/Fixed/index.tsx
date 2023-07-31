import Box from "@mui/material/Box";
import Style from "./index.scss";
import { CSSProperties, MouseEventHandler, PropsWithChildren, useEffect } from "react";
// import { menuBarHeight as top } from "~/Components/Layouts/MainLayout";

interface Props {
    top: number,
    className?: HTMLElement['className'];
    style?: CSSProperties;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export default ({top, children, className, style={}, onClick}: PropsWithChildren<Props>) => {

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    return <Box onClick={onClick} className={`${className || ''} ${Style.fixed}`} style={{
        top,
        height: `calc(100vh - ${top}px)`,
        ...style}}>
        {children}
    </Box>
}
