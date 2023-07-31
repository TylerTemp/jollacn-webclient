import { HTMLProps, PropsWithChildren } from 'react';
import {
    Outlet,
} from 'react-router-dom';
// import Box from '@mui/system/Box';
import Container from '@mui/material/Container';
import { Breakpoint } from '@mui/system';
// import Style from "./index.css";


// export const WidthLimit = ({children}: PropsWithChildren) => <Box className={Style.container}>
//     <Container maxWidth="md" className={Style.widthLimit}>
//         {children}
//     </Container>
// </Box>;
export const WidthLimit = ({className, children, maxWidth="lg"}: PropsWithChildren<{maxWidth?: Breakpoint | false, className?: HTMLProps<HTMLElement>["className"]}>) => <Container className={className} maxWidth={maxWidth}>
    {children}
</Container>;


export default () => <WidthLimit><Outlet /></WidthLimit>;
