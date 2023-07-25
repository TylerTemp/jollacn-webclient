import React from 'react';
import {
  Link,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import parse from 'html-react-parser';

import Comment from '~/component/Comment';

const RenderLoading = () => (
  <>
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
    <Skeleton animation="wave" height={40} width="80%" />
    <Skeleton sx={{ height: 160 }} animation="wave" variant="rectangular" />
  </>
);

const RenderError = ({ error, onRetry }) => (
  <Alert
    severity="error"
    action={(
      <Button color="inherit" size="small" onClick={onRetry}>
        重试
      </Button>
)}
  >
    {error}
  </Alert>
);

const RenderImageItem = ({ item }) => {
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

  const { src } = item;

  return (
    <ImageListItem>
      <img
        src={src}
      />
    </ImageListItem>
  );
};

const getReturnUri = (page) => {
  switch (page) {
    case null:
      return '/';
    case 1:
      return '/tie';
    default:
      return `/tie/page/${page}`;
  }
};

export default ({
  loading,
  error,
  result: {
    content,
    medias = [],
  },
  onRetry,
  tieId,

  page,
}) => (
  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <Box sx={{ width: '100%', maxWidth: '1100px' }}>

      <Box sx={{ margin: '15px 5px' }}>
        <Link to={getReturnUri(page)}>
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

            {loading && <RenderLoading />}
            {error && <RenderError error={error} onRetry={onRetry} />}
            {!loading && !error && (
            <>
              <Typography variant="body1" component="div">
                {parse(content)}
              </Typography>
            </>
            )}

            {medias.length > 0 && (
            <>
              <Divider />
              <ImageList cols={1}>
                {medias.map((item) => <RenderImageItem key={item.type === 'video' ? item.sources[0].src : item.src} item={item} />)}
              </ImageList>
            </>
            )}
          </Box>
        </Box>
      </Paper>
      <Box sx={{ height: '15px' }} />
      <Comment uri={`/api/tie/${tieId}/comment`} />
    </Box>
  </Box>
);
