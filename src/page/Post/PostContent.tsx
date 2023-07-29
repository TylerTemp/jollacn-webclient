import { Suspense, useEffect, useMemo, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import Suspendable from "~/Utils/Suspendable";
import { type Post } from "~/Utils/Types";
import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import RetryErrorBoundary from "~/component/RetryErrorBoundary";

import postParser from "./postParser";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import parse from 'html-react-parser';
import Author from "./Author";
import Style from "./PostContent.scss";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import styled from "@emotion/styled";
import MuiLink from '@mui/material/Link';
import Comment from "~/component/Comment";
import Stack from "@mui/material/Stack";
// import AbsCarousel from "~/component/AbsCarousel";
import Carousel from "~/component/Carousel";
import Fixed from "~/component/Fixed";

import {
    Text
} from 'domhandler';
// import Portal from "@mui/material/Portal";
import { type StepperProps } from "~/component/Carousel";
import useTheme from "@mui/material/styles/useTheme";

// const Article = styled.article`
//     img.plugin-figure-img {
//         max-width: 100%;
//     }
// `;

interface RendererProps {
    getPost: () => Post
}

// interface ForceStepperProps extends StepperProps {
//     forceStep: number,
// }

const Stepper = ({setActiveStep}: StepperProps) => {
    // const [curForceStep, setCurForceStep] = useState<number>(forceStep);
    // useEffect(() => {
    //     console.log(curForceStep, forceStep);
    //     if(curForceStep != forceStep) {
    //         setCurForceStep(forceStep);
    //         setActiveStep(_oldStep => forceStep);
    //     }
    // }, [forceStep]);

    return <></>;
}

const Renderer = ({getPost}: RendererProps) => {
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const {dim} = useTheme();

    return <>
        <article className={Style.article}>
            <img src={headerImg} className={Style.headerImg} title={title} alt={title} />

            <Typography variant="h1" gutterBottom className={Style.title}>
                {title}
            </Typography>

            {!description && <Divider />}

            <Box className={Style.articleContentWrapper}>
                <Box className={`${Style.articleContent} ${Style.paperPadding}`}>
                    {description && <Paper className={Style.description} variant="outlined">
                        <Typography variant="body2" color="text.secondary" component="div">
                            {parse(description)}
                        </Typography>
                    </Paper>}

                    {parseResult}

                    <Divider />

                    {sourceAuthors.map((authorId) => <Author key={authorId} id={authorId} />)}

                    {sourceUrl && <Typography variant="body2" paragraph gutterBottom paddingTop="20px" component="div">
                        原文：
                        {' '}
                        <MuiLink target="_blank" href={sourceUrl} rel="noreferrer">{sourceTitle}</MuiLink>
                    </Typography>}
                </Box>
            </Box>
        </article>

        {displayCarousel !== -1 && <Fixed style={{backgroundColor: dim}} onClick={() => setDisplayCarousel(-1)}>
            <Carousel
                index={displayCarousel}
                displays={mediaList.map(({enlargeUrl, figCaptionInfo, imgInfo}, index) => ({type: 'img', src: enlargeUrl ?? imgInfo.attribs.src, key: index, label: (figCaptionInfo?.firstChild as Text)?.data}))}
                stepper={params => <Stepper {...params}/>}
                onBgClick={() => setDisplayCarousel(-1)}
            />
        </Fixed>}
    </>;
}

interface Props {
    slug: string,
    backUrl: string
}

export default ({slug, backUrl}: Props) => {
    const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    // console.log(`retryKey`, retryKey);

    const getPost = useMemo(
        () => Suspendable(
            ReqJsonToType<Post>(`/post/${slug}`, {signal: doAbort()})
        ),
        [retryKey]);

    return <Stack gap={2}>
        <Box>
            <Link to={backUrl}>
            <Button variant="contained" color="info" startIcon={<ArrowBackIosIcon />}>
                返回
            </Button>
            </Link>
        </Box>

        <Paper className={Style.spaceBottom}>
            <RetryErrorBoundary onRetry={doRetry}>
                <Suspense fallback={<p>Loading</p>} key={retryKey}>
                    <Renderer
                        key={retryKey}
                        getPost={getPost} />
                </Suspense>
            </RetryErrorBoundary>
        </Paper>

        <Paper className={`${Style.spaceBottom} ${Style.paperPadding}`}>
            <Box className={`${Style.articleContentWrapper} ${Style.commentSection}`}>
                <Box className={Style.articleContent}>
                    <Comment uri={`/post/${slug}/comment`} />
                </Box>
            </Box>
        </Paper>
    </Stack>;
}
