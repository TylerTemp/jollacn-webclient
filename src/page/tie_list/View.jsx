import React, { Fragment } from 'react';
import {
  Link,
} from 'react-router-dom';

import Box from '@mui/system/Box';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';

import { UniversalStyle as Style } from 'react-css-component';
import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';

import Pagination from '~/component/pagination';


const MakeMediaPreview = ({previews}) => {
  // console.log('previews:', previews);
  // previews.map((preview, _index) => {
  //   console.log(`${preview["type"]}, ${preview["src"]}`)
  // })

  const previewLength = previews.length;

  if (previewLength === 0) {
    return null;
  }

  if (previewLength === 1) {
    const {src, type} = previews[0];
    return <ImageList height={200} cols={1} sx={{margin: 0}}>
      <ImageListItem key={src}>
        { type == 'video_poster' && <PlayCircleOutlineIcon />}
        <img src={src} />
      </ImageListItem>
    </ImageList>;
  } if (previewLength === 2) {
    return <ImageList height={200} cols={2} spacing={1} sx={{margin: 0}}>
      {previews.map(({src, type}) => <ImageListItem key={src}>
        { type == 'video_poster' && <PlayCircleOutlineIcon />}
        <img src={src} />
      </ImageListItem>)}
    </ImageList>;
  }

  const firstTile = previews[0];
  const restTile = previews.slice(1);
  return <ImageList height={100} cols={restTile.length} spacing={1} sx={{margin: 0}}>
    <ImageListItem key={firstTile.src} cols={restTile.length} rows={1}>
      { firstTile.type == 'video_poster' && <PlayCircleOutlineIcon />}
      <img src={firstTile.src} />
    </ImageListItem>
    {restTile.map(({src, type}) => <ImageListItem key={src}>
      { type == 'video_poster' && <PlayCircleOutlineIcon />}
      <img src={src} />
    </ImageListItem>)}
  </ImageList>;
};


const MediaViewer = ({state: {isOpen, medias, content, index: mediaIndex}, close, setIndex}) => {
  if(!isOpen) {
    return null;
  }

  const mediaSrcs = medias.map(({type, src, poster}) => {
    if (type == 'img') {
      return src;
    }
    return <Box sx={{display: 'flex', justifyContent: 'center'}}>
      <video controls crossOrigin="anonymous" poster={poster}>
        抱歉，你的浏览器不支持<code>video</code>元素
        {media.sources.map(({ mime, src }) => <source key={src} src={src} type={mime} />)}
        {media.subtitles && media.subtitles.map((subtitle, index) => <track
          key={subtitle.src}
          default={index == 0}
          kind="subtitles"
          label={subtitle.label}
          src={subtitle.src}
          srcLang={subtitle.srclang}
        />)}
      </video>
    </Box>;
  });

  let lightboxCss = `
    .ril-image-current {
      top: 0;
    }`;

  for (let index = 0; index < medias.length; index++) {
    const currentMedia = medias[index];
    if (currentMedia.type == 'video') {
      lightboxCss = `
          .ril-image-current {
            top: unset;
          }
        `;
      break;
    }
  }

  const mediaCount = mediaSrcs.length;

  return <>
    <Style css={lightboxCss} />
    <Lightbox
      reactModalStyle={{
        overlay: {
          zIndex: 2000,
        },
      }}
      enableZoom={medias[mediaIndex].type == 'img'}
      imageCaption={medias[mediaIndex].type == 'img' && <div dangerouslySetInnerHTML={{ __html: content }} />}
      imageTitle={medias[mediaIndex].title || medias[mediaIndex].alt || false}
      mainSrc={mediaSrcs[mediaIndex]}
      nextSrc={mediaSrcs[(mediaIndex + 1) % mediaCount]}
      prevSrc={mediaSrcs[(mediaIndex + mediaCount - 1) % mediaCount]}
      onCloseRequest={close}
      onMovePrevRequest={() => setIndex((mediaIndex + mediaCount - 1) % mediaCount)}
      onMoveNextRequest={() => setIndex((mediaIndex + 1) % mediaCount)}
    />
  </>
}



export default ({
  loading,
  error,
  offset,
  limit,
  total,
  tieList,
  fetchTieList,
  onRetry,

  mediaViewerState,
  openMediaViewer,
  closeMediaViewer,
  setMediaViewerIndex,
}) => {
    return <>
      <Grid container spacing={4}>
        {tieList.map(({id, content, medias, media_previews: mediaPreviews}) => <Fragment key={id}>
          <Grid item xs={12 / 1} md={12 / 3} lg={12 / 4}>
            <Card>
              <CardActionArea onClick={() => openMediaViewer(content, medias)}>
                <MakeMediaPreview previews={mediaPreviews} />
              </CardActionArea>
              <Link
                to={{
                  pathname: `/tie/${id}`,
                  state: { modal: true, return_to: `` },
                }}
                style={{textDecoration: 'inherit', color: 'inherit'}}
              >
                <CardActionArea>
                  <CardContent>
                    <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: content }} />
                  </CardContent>
                </CardActionArea>
              </Link>
            </Card>
          </Grid>
        </Fragment>)}
      </Grid>

      {loading && <Box sx={{height: '100px', display: 'flex', justifyContent: 'center'}}>
        <CircularProgress color="secondary" />
      </Box>}
      {error && <Paper>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={onRetry}>
              重试
            </Button>
          }
        >
          {error}
        </Alert>
      </Paper>}
      <Box sx={{display: 'flex', justifyContent: 'center', padding: '20px 0 0 0'}}>
        <Paper>
          <Pagination offset={offset} limit={limit} total={total} onChange={fetchTieList} />
        </Paper>
      </Box>

      <MediaViewer
        state={mediaViewerState}
        close={closeMediaViewer}
        setIndex={setMediaViewerIndex}
      />
    </>;
};
