import Box from "@mui/material/Box";
import Carousel, { type Props as CarouselProps} from "~/component/Carousel";
import Style from "./index.scss";
import useTheme from "@mui/material/styles/useTheme";

interface Props extends CarouselProps {
    onClick: () => void,
    display: boolean,
}

export default ({onClick, display, ...params}: Props) => {

    const theme = useTheme();
    const backgroundColor = theme.dim;

    return <Box className={Style.dimOverlay} style={{backgroundColor, display: display? 'block': 'none'}} onClick={onClick}>
        <Carousel {...params}/>
    </Box>
}
