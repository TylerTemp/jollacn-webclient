import { Suspense, useEffect, useMemo, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import Suspendable from "~/Utils/Suspendable";
import { type Tie, TieImg } from "~/Utils/Types";
import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import RetryErrorBoundary from "~/component/RetryErrorBoundary";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import parse from 'html-react-parser';
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
import Skeleton from "@mui/material/Skeleton";

const TieSkeleton =() => <>
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} width="80%" />
    <Skeleton sx={{ height: 160 }} animation="wave" variant="rectangular" />
</>;

const RenderImageItem = ({ item }: ) => {
    const { type } = item;
    if (type === 'video') {
      const { sources, subtitles, poster } = item;
      return (
        <ImageListItem>
          <video controls crossOrigin="anonymous" poster={poster}>
            抱歉，你的浏览器不支持
            <code>video</code>
            元素
            {sources.map(({ mime, src }) => <source key={src} src={src} type={mime} />)}
            {subtitles.map((subtitle, index) => (
              <track
                key={subtitle.src}
                default={index === 0}
                kind="subtitles"
                label={subtitle.label}
                src={subtitle.src}
                srcLang={subtitle.srclang}
              />
            ))}
          </video>
        </ImageListItem>
      );
    }



interface RendererProps {
    getTie: () => Tie
}


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

const Renderer = ({getTie}: RendererProps) => {
    const {
        medias,
        content,
    } = getTie();

    const [displayCarousel, setDisplayCarousel] = useState<number>(-1);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    const {dim} = useTheme();

    return <>
        <article className={Style.article}>
            <img src={headerImg} className={Style.headerImg} title={title} alt={title} />

            <Typography variant="h1" gutterBottom sx={{ textAlign: 'center', padding: '20px 0px' }}>
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
            ReqJsonToType<Post>(`/tie/${slug}`, {signal: doAbort()})
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
                        getTie={getPost} />
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
