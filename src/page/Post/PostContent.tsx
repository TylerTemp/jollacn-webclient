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
import parse, { domToReact } from 'html-react-parser';
import Author from "./Author";
import useRetry from "~/Utils/useRetry";

interface RendererProps {
    getPost: () => Post
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
    const { parseResult, mediaList } = postParser({
        html: content,
        onImageClick: (index: number) => console.log(`click on image ${index}`)
      });


    return <Paper component="article">
            <Typography variant="h1" gutterBottom sx={{ textAlign: 'center', padding: '20px 0px' }}>
              {title}
            </Typography>

              <Divider />

              {description && <Box sx={{
                color: '#666', border: '1px solid #dedede', padding: '0 10px', marginTop: '5px', background: '#f9f9f9', borderRadius: '2px',
              }}
              >
                <Typography variant="body2" color="text.secondary" component="div">
                   {parse(description)}
                </Typography>
              </Box>}

              <>
                {parseResult}
                <Divider />
                {sourceAuthors.map((authorId) => <Author key={authorId} id={authorId} />)}
              </>

              {sourceUrl && (
              <Typography variant="body2" paragraph gutterBottom paddingTop="20px">
                原文：
                {' '}
                <a target="_blank" href={sourceUrl} rel="noreferrer">{sourceTitle}</a>
              </Typography>
              )}
    </Paper>
}

interface Props {
    slug: string,
    backUrl: string
}

export default ({slug, backUrl}: Props) => {
    const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    const getPost = useMemo(
        () => Suspendable(
            ReqJsonToType<Post>(`/post/${slug}`, {signal: doAbort()})
        ),
        [retryKey]);

    return <RetryErrorBoundary onRetry={doRetry}>
        <Suspense fallback={<p>Loading</p>} key={retryKey}>
            <Renderer
                key={retryKey}
                getPost={getPost} />
        </Suspense>
    </RetryErrorBoundary>;
}
