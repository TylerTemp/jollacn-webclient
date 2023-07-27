import Box from "@mui/material/Box";
import Carousel, { type Props as CarouselProps} from "~/component/Carousel";
import Style from "./index.scss";
import useTheme from "@mui/material/styles/useTheme";
import { useEffect } from "react";
import { menuBarHeight } from "../Layouts/MainLayout";

interface Props extends CarouselProps {
    onClick: () => void,
    display: boolean,
}

export default ({onClick, display, ...params}: Props) => {

    const {dim: backgroundColor} = useTheme();

    useEffect(() => {
        if(display) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [display]);

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'auto';
        }
    }, []);

    return <Box className={Style.dimOverlay} style={{
            backgroundColor,
            top: menuBarHeight,
            // display: display? 'block': 'none'

        }} onClick={onClick} visibility={display? 'visible': 'hidden'}>
        <Box className={Style.container}>
            <Carousel {...params}/>
        </Box>
    </Box>
}
