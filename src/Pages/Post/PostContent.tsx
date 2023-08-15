import { useMemo, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
// import Suspendable from "~/Utils/Suspendable";
import { type Post } from "~/Utils/Types";
// import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
// import RetryErrorBoundary from "~/Components/RetryErrorBoundary";

import postParser from "./PostParser";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import parse from 'html-react-parser';
import Author from "./Author";
import Style from "./PostContent.scss";
import { Link } from "react-router-dom";
// import styled from "@emotion/styled";
import MuiLink from '@mui/material/Link';
import Comment from "~/Components/Comment";
import Stack from "@mui/material/Stack";
// import AbsCarousel from "~/Components/AbsCarousel";
import Carousel from "~/Components/Carousel";
import Fixed from "~/Components/Fixed";

import {
    Text
} from 'domhandler';
// import Portal from "@mui/material/Portal";
// import { type StepperProps } from "~/Components/Carousel";
import useTheme from "@mui/material/styles/useTheme";
import { WidthLimit } from "~/Components/Layouts/WidthLimitLayout";
import Skeleton from "@mui/material/Skeleton";
import { menuBarHeight } from "~/Components/Layouts/MainLayout";
import RetryErrorSuspense, { type RendererProps } from "~/Components/RetryErrorSuspense";
import ReadMoreTwoToneIcon from '@mui/icons-material/ReadMoreTwoTone';
import Fab from "@mui/material/Fab";

// const Article = styled.article`
//     img.plugin-figure-img {
//         max-width: 100%;
//     }
// `;

const PostSkeleton =() => <>
    <Skeleton height={350} variant="rectangular" />

    <Typography variant="h1" gutterBottom className={Style.title}>
        <Skeleton />
    </Typography>

    <WidthLimit className={Style.spaceBottom} maxWidth="md">
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" width="70%" />
    </WidthLimit>
</>;

// interface RendererProps {
//     getResource: () => Post
// }

const Renderer = ({getResource: getPost}: RendererProps<Post>) => {
    const {
        headerimg: headerImg,
        title,
        description,
        source_authors: sourceAuthors = [],
        source_url: sourceUrl,
        source_title: sourceTitle,
        content,
    } = getPost();

    // console.log(`getPost`, title);

    const [displayCarousel, setDisplayCarousel] = useState<number>(-1);

    const { parseResult, mediaList } = postParser({
        html: content,
        onImageClick: (index: number) => {
            console.log(`click on image ${index}`);
            setDisplayCarousel(index);
        }
    });

    const {dim} = useTheme();

    return <>
        <article className={Style.article}>
            <img src={headerImg} className={Style.headerImg} title={title} alt={title} />

            <Typography variant="h1" gutterBottom className={Style.title}>
                {title}
            </Typography>

            {!description && <Divider />}

            <WidthLimit className={Style.paperPadding} maxWidth="md">
                <Stack gap={1} divider={<Divider />}>
                    <Box>
                        {description && <Paper className={Style.description} variant="outlined">
                            <Typography variant="body2" color="text.secondary" component="div">
                                {parse(description)}
                            </Typography>
                        </Paper>}

                        {parseResult}
                    </Box>

                    {sourceAuthors.length > 0 && <Box>
                        {sourceAuthors.map((authorId) => <Author key={authorId} id={authorId} />)}
                    </Box>}

                    {sourceUrl && <Typography variant="body2" paragraph gutterBottom paddingTop="20px" component="div">
                        原文：
                        {' '}
                        <MuiLink target="_blank" href={sourceUrl} rel="noreferrer">{sourceTitle}</MuiLink>
                    </Typography>}
                </Stack>
            </WidthLimit>
        </article>

        {displayCarousel !== -1 && <Fixed zIndex={300} top={menuBarHeight} style={{backgroundColor: dim}}>
            <Carousel
                index={displayCarousel}
                onClose={() => setDisplayCarousel(-1)}
                displays={mediaList.map(({enlargeUrl, figCaptionInfo, imgInfo}, index) => ({type: 'img', src: enlargeUrl ?? imgInfo.attribs.src, key: index, label: (figCaptionInfo?.firstChild as Text)?.data}))}
                // stepper={params => <Stepper {...params}/>}
            />
        </Fixed>}
    </>;
}

interface Props {
    slug: string,
    backUrl: string
}

export default ({slug, backUrl}: Props) => {

    const makePromise = useMemo(() => {
        return (abortController: AbortController) => ReqJsonToType<Post>(`/post/${slug}`, {signal: abortController.signal});
    }, [slug]);

    return <Stack gap={2}>
        <Link to={backUrl} className={Style.backButton}>
            <Fab size="small">
                <ReadMoreTwoToneIcon className={Style.flipX} />
            </Fab>
        </Link>

        <Paper className={Style.spaceBottom}>
            <RetryErrorSuspense<Post>
                noTrace
                makePromise={makePromise}
                fallback={<PostSkeleton />}
                renderer={Renderer}
            />
        </Paper>

        <Paper className={`${Style.spaceBottom} ${Style.verticalPadding}`}>
            <WidthLimit maxWidth="md">
                <Comment uri={`/post/${slug}/comment`} />
            </WidthLimit>
        </Paper>
    </Stack>;
}
