import { useMemo, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import { type Tie, TieImg, TieVideo } from "~/Utils/Types";
// import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";

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
import Comment from "~/Components/Comment";
import Stack from "@mui/material/Stack";
// import AbsCarousel from "~/Components/AbsCarousel";
import Carousel from "~/Components/Carousel";
import Fixed from "~/Components/Fixed";

// import Portal from "@mui/material/Portal";
import useTheme from "@mui/material/styles/useTheme";
import Skeleton from "@mui/material/Skeleton";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import { WidthLimit } from "~/Components/Layouts/WidthLimitLayout";
import { menuBarHeight } from "~/Components/Layouts/MainLayout";
import RetryErrorSuspense, { type RendererProps } from "~/Components/RetryErrorSuspense";

const TieSkeleton =() => <>
    <Skeleton height={40} />
    <Skeleton height={40} />
    <Skeleton height={40} />
    <Skeleton height={40} width="80%"/>
    <Skeleton sx={{ height: 350 }} variant="rectangular" />
</>;


const Renderer = ({getResource: getTie}: RendererProps<Tie>) => {
    const {
        medias,
        content,
    } = getTie();

    const [tieVideos, tieImgs] = useMemo(() => {
        const tieVideos: TieVideo[] = [];
        const tieImgs: TieImg[] = [];
        medias.forEach((each) => {
            if(each.type === 'video') {
                tieVideos.push(each as TieVideo);

            } else if(each.type === 'img') {
                tieImgs.push(each as TieImg);
            }
        });
        return [tieVideos, tieImgs];
    }, [medias]);

    const [displayCarousel, setDisplayCarousel] = useState<number>(-1);

    // useEffect(() => {
    //     window.scrollTo({ top: 0, behavior: "instant" });
    // }, []);

    const {dim} = useTheme();

    return <>
        <article className={Style.article}>
            <Typography variant="body1" component="div">
                {parse(content)}
            </Typography>

            {medias.length > 0 && <>
                <Divider />
                <ImageList cols={1}>
                    {tieVideos.map(({sources, subtitles, poster}) => <ImageListItem key={sources[0].src}>
                        <video controls crossOrigin="anonymous" poster={poster}>
                            抱歉，你的浏览器不支持<code>video</code>元素
                            {sources.map(({ mime, src }) => <source key={src} src={src} type={mime} />)}
                            {subtitles.map((subtitle, index) => <track
                                key={subtitle.src}
                                default={index === 0}
                                kind="subtitles"
                                label={subtitle.label}
                                src={subtitle.src}
                                srcLang={subtitle.srclang}
                            />)}
                        </video>
                    </ImageListItem>)}
                    {tieImgs.map(({src}, index) => <ImageListItem key={src}>
                        <Button onClick={() => setDisplayCarousel(index)}>
                            <img src={src} />
                        </Button>
                    </ImageListItem>)}
                </ImageList>
            </>}
        </article>

        {displayCarousel !== -1 && <Fixed top={menuBarHeight} style={{backgroundColor: dim}}>
            <Carousel
                index={displayCarousel}
                displays={tieImgs.map(({src}) => ({type: 'img', src, key: src, label: undefined}))}
                onClose={() => setDisplayCarousel(-1)}
            />
        </Fixed>}
    </>;
}

interface Props {
    tieId: string,
    backUrl: string
}

export default ({tieId, backUrl}: Props) => {
    // const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    // // console.log(`retryKey`, retryKey);

    // const getPost = useMemo(
    //     () => Suspendable(
    //         ReqJsonToType<Tie>(`/tie/${tieId}`, {signal: doAbort()})
    //             .then((result): Tie => {
    //                 const {medias} = result;
    //                 const parsedMedias = medias.map((item) => {
    //                     switch (item.type) {
    //                     case 'img':
    //                         return item as TieImg;
    //                     case 'video':
    //                         return item as TieVideo;
    //                     }
    //                 });

    //                 return {...result, medias: parsedMedias};
    //             })
    //     ),
    //     [retryKey]);

    const makePromise = useMemo(() => {
        return (abortController: AbortController) => ReqJsonToType<Tie>(`/tie/${tieId}`, {signal: abortController.signal})
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
            });
    }, [tieId]);


    return <WidthLimit>
        <Stack gap={2}>
            <Box>
                <Link to={backUrl}>
                    <Button variant="outlined" color="info" startIcon={<ArrowBackIosIcon />}>
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
                        {/* <RetryErrorBoundary onRetry={doRetry}>
                            <Suspense fallback={<TieSkeleton />} key={retryKey}>
                                <Renderer
                                    key={retryKey}
                                    getTie={getPost} />
                            </Suspense>
                        </RetryErrorBoundary> */}
                        <RetryErrorSuspense<Tie>
                            noTrace
                            makePromise={makePromise}
                            fallback={<TieSkeleton />}
                            renderer={Renderer}
                        />
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
