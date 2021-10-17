import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import parse from 'html-react-parser';

import Author from './author';


const CardLayout = ({children}) => <Card sx={{margin: '0px 5px'}}>{children}</Card>;


const ContentLayout = ({children}) => <Box sx={{display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center'}}>
  <Box sx={{maxWidth: '900px', width: '100%'}}>
    {children}
  </Box>
</Box>;


export default ({loading, error, result: {headerimg: headerImg, title, description, source_authors: sourceAuthors=[], source_url: sourceUrl, source_title: sourceTitle}, onRetry, children}) => {

  if(loading) {
    return <CardLayout>
      <Skeleton sx={{ height: 160 }} animation="wave" variant="rectangular" />
      <CardContent>
        <ContentLayout>
          <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
          <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
          <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }}  width="80%" />
          <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
          <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
          <Skeleton animation="wave" height={40} width="80%" />
        </ContentLayout>
      </CardContent>
    </CardLayout>
  }

  if(error) {
    return <CardLayout>
      <CardContent>
        <ContentLayout>
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
        </ContentLayout>
      </CardContent>
    </CardLayout>;
  }

  return <CardLayout>
    <CardMedia
      component="img"
      image={headerImg}
    />
    <CardContent>
      <article>
        <Typography variant="h1" component="div" gutterBottom sx={{textAlign: 'center', padding: '20px 0px'}}>
          {title}
        </Typography>

        <ContentLayout>
          <Divider />

          <Box sx={{color: '#666', border: '1px solid #dedede', padding: '0 10px', marginTop: '5px', background: '#f9f9f9', borderRadius: '2px'}}>
            <Typography variant="body2" color="text.secondary" component="div">
              {description && parse(description)}
            </Typography>
          </Box>
          <>
            {children}
            <Divider />
            {sourceAuthors.map(authorId => <Author key={authorId} authorId={authorId} />)}
          </>

          {sourceUrl && <Typography variant="body2" paragraph gutterBottom paddingTop="20px">
            原文： <a target="_blank" href={sourceUrl}>{sourceTitle}</a>
          </Typography>}
        </ContentLayout>

      </article>
    </CardContent>
  </CardLayout>;
}
