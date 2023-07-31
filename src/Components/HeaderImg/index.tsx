import Box from "@mui/material/Box";
import Style from "./index.scss";
import { Link } from "react-router-dom";
import BlogHeaderImg from '~/asset/image/blog_header.png';

export default () => <Box className={Style.container}>
    <Link to="/">
        <img className={Style.headerImg} src={BlogHeaderImg} alt="Jolla非官方中文博客" />
    </Link>
</Box>;
