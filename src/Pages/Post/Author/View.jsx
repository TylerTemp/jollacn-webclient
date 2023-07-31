import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';

const ContentLayout = ({ children }) => (
  <Box sx={{
    display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center',
  }}
  >
    <Box sx={{ maxWidth: '900px', width: '100%' }}>
      {children}
    </Box>
  </Box>
);

export default ({
  loading, error, result: { display_name: displayName, avatar = {} }, onRetry, children,
}) => {
  if (loading) {
    return (
      <ContentLayout>
        <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
        <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
        <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} width="80%" />
        <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
        <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
        <Skeleton animation="wave" height={40} width="80%" />
      </ContentLayout>
    );
  }

  if (error) {
    return (
      <ContentLayout>
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
      </ContentLayout>
    );
  }

  const { default: defaultAvatar } = avatar;
  const avatarSet = { ...avatar };
  delete avatarSet.default;
  const avatarSets = Object.entries(avatarSet).map(([key, value]) => `${value} ${key}`);
  const avatarSetAttr = avatarSets.length === 0
    ? null
    : avatarSets.join(', ');

  return (
    <ContentLayout>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Avatar
            alt={displayName}
            src={defaultAvatar}
            srcSet={avatarSetAttr}
            sx={{
              width: '100%',
              height: 'auto',
            }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', padding: '20px 0px' }}>
              {displayName}
            </Typography>
            <Typography variant="body" sx={{ padding: '20px 0px' }}>
              {children}
            </Typography>
          </>
        </Grid>
      </Grid>
    </ContentLayout>
  );
};
