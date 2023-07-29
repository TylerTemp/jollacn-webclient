import React, { Suspense, useEffect, useMemo, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import Suspendable from "~/Utils/Suspendable";
import { type Tie, TieImg, TieMediaGuess, TieVideo } from "~/Utils/Types";
import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import RetryErrorBoundary from "~/component/RetryErrorBoundary";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import parse from 'html-react-parser';
import Style from "./TieContent.scss";
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
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import { WidthLimit } from "~/component/Layouts/WidthLimitLayout";

const TieSkeleton =() => <>
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} width="80%" />
    <Skeleton sx={{ height: 160 }} animation="wave" variant="rectangular" />
</>;

// function RendererMedia({media}: {media: TieVideo}): JSX.Element;
// function RendererMedia({media}: {media: TieImg}): JSX.Element;
function RendererMedia({media}: {media: TieMediaGuess}): JSX.Element {
    const { type } = media;
    if (type === 'video') {
      const { sources, subtitles, poster } = media as TieVideo;
      return <ImageListItem>
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
      </ImageListItem>;
    }

    const { src } = media as TieImg;

    return <ImageListItem>
        <img src={src} />
    </ImageListItem>;
}

// const RenderImageItem = (tieMedia: TieMediaGuess) => {
//     const { type } = tieMedia;
//     if (type === 'video') {
//       const { sources, subtitles, poster } = tieMedia as TieVideo;
//       return (
//         <ImageListItem>
//           <video controls crossOrigin="anonymous" poster={poster}>
//             抱歉，你的浏览器不支持
//             <code>video</code>
//             元素
//             {sources.map(({ mime, src }) => <source key={src} src={src} type={mime} />)}
//             {subtitles.map((subtitle, index) => (
//               <track
//                 key={subtitle.src}
//                 default={index === 0}
//                 kind="subtitles"
//                 label={subtitle.label}
//                 src={subtitle.src}
//                 srcLang={subtitle.srclang}
//               />
//             ))}
//           </video>
//         </ImageListItem>
//       );
//     }

//     const { src } = tieMedia as TieImg;

//     return <ImageListItem>
//         <img src={src} />
//     </ImageListItem>;
// }


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
            <Typography variant="body1" component="div">
                {parse(content)}
            </Typography>

            {medias.length > 0 && <>
                <Divider />
                <ImageList cols={1}>
                    {medias.map((item) => <RendererMedia key={item.type === 'video' ? item.sources[0].src : item.src} media={item} />)}
                </ImageList>
            </>}
        </article>
{/*
        {displayCarousel !== -1 && <Fixed style={{backgroundColor: dim}} onClick={() => setDisplayCarousel(-1)}>
            <Carousel
                index={displayCarousel}
                displays={mediaList.map(({enlargeUrl, figCaptionInfo, imgInfo}, index) => ({type: 'img', src: enlargeUrl ?? imgInfo.attribs.src, key: index, label: (figCaptionInfo?.firstChild as Text)?.data}))}
                stepper={params => <Stepper {...params}/>}
            />
        </Fixed>} */}
    </>;
}

interface Props {
    tieId: string,
    backUrl: string
}

export default ({tieId, backUrl}: Props) => {
    const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    // console.log(`retryKey`, retryKey);

    const getPost = useMemo(
        () => Suspendable(
            ReqJsonToType<Tie>(`/tie/${tieId}`, {signal: doAbort()})
                .then((result): Tie => {
                    const {medias} = result;
                    const parsedMedias = medias.map((item) => {
                        switch (item.type) {
                            case 'img':
                                return item as TieImg;
                            case 'video':
                                return item as TieVideo;
                        }
                    });

                    return {...result, medias: parsedMedias};
                })
        ),
        [retryKey]);

    return <WidthLimit>
        <Stack gap={2}>
            <Box>
                <Link to={backUrl}>
                <Button variant="contained" color="info" startIcon={<ArrowBackIosIcon />}>
                    返回
                </Button>
                </Link>
            </Box>

            <Paper sx={{
                margin: '0px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
            >
                <Box sx={{ maxWidth: '900px', width: '100%' }}>
                    <Box sx={{ padding: '10px 10px' }}>
                        <RetryErrorBoundary onRetry={doRetry}>
                            <Suspense fallback={<TieSkeleton />} key={retryKey}>
                                <Renderer
                                    key={retryKey}
                                    getTie={getPost} />
                            </Suspense>
                        </RetryErrorBoundary>
                    </Box>
                </Box>
            </Paper>

            <Paper className={`${Style.spaceBottom} ${Style.paperPadding}`}>
                <Box className={`${Style.articleContentWrapper} ${Style.commentSection}`}>
                    <Box className={Style.articleContent}>
                        <Comment uri={`/tie/${tieId}/comment`} />
                    </Box>
                </Box>
            </Paper>
        </Stack>
    </WidthLimit>;
}
