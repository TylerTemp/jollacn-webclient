import React from 'react';

import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
// import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/system/Box';
import red from '@mui/material/colors/red';

export default ({
  loading,
  error,
  result,

  nickname,
  setNickname,
  email,
  setEmail,
  content,
  setContent,
  onSubmit,
  dismissError,
  dismissResult,
  uri,
}) => (
  <form
    method="POST"
    action={uri}
    onSubmit={(evt) => {
      evt.preventDefault();
      onSubmit();
      return false;
    }}
  >
    <fieldset disabled={loading ? 'disabled' : false}>
      <legend>评论</legend>
      <Grid container spacing={1}>
        <Grid
          item
          sm={12}
          md={6}
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="comment-name">
              <span style={{ color: red[500] }}>*</span>
              {' '}
              昵称
            </InputLabel>
            <Input
              id="comment-name"
              startAdornment={(
                <>
                  <InputAdornment position="start">
                    <AccountCircleOutlinedIcon />
                  </InputAdornment>
                </>
)}
              type="text"
              name="nickname"
              value={nickname}
              onChange={({ target: { value } }) => setNickname(value)}
              placeholder="* 怎么称呼您呐_(:з」∠)_"
              required
            />
          </FormControl>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
        >
          <FormControl fullWidth>
            <InputLabel htmlFor="comment-email">邮箱(可选)</InputLabel>
            <Input
              id="comment-email"
              startAdornment={(
                <>
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                </>
)}
              type="email"
              name="email"
              value={email}
              onChange={({ target: { value } }) => setEmail(value)}
              placeholder="不会被显示和公布"
            />
          </FormControl>
        </Grid>

        <Grid
          item
          sm={12}
        >
          <FormControl fullWidth>
            <Input
              id="comment-content"
              multiline
              minRows={3}
              startAdornment={(
                <>
                  <InputAdornment position="start">
                    <TextsmsOutlinedIcon />
                  </InputAdornment>
                </>
)}
              type="text"
              name="content"
              value={content}
              onChange={({ target: { value } }) => setContent(value)}
              placeholder="*来都来了不说说都不好意思直接走..."
              required
            />
          </FormControl>
        </Grid>

        <Grid item sm={9}>
          { error && (
          <Alert
            severity="error"
            onClose={dismissError}
          >
            {error}
          </Alert>
          )}
          { result && (
          <Alert
            onClose={dismissResult}
          >
            发布成功
          </Alert>
          )}
        </Grid>
        <Grid item sm={3}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              type="submit"
              endIcon={<SendIcon />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              提交
            </LoadingButton>
          </Box>
        </Grid>
      </Grid>
    </fieldset>
  </form>
);
