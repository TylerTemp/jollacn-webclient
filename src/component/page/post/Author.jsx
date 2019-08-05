import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import axios from 'axios';

import { unstable_createResource as createResource } from 'react-cache';
// import classNames from 'classnames';

import Suspenser from '~/component/Suspenser';


const authorResource = createResource(
  authorName => (
    new Promise((resolve, reject) => {
      axios.get(`/api/author/${authorName}`, { transformResponse: undefined })
        .then((res) => {
          const { data } = res;
          const author = JSON.parse(data);
          resolve(author);
        })
        .catch((res) => {
          let error = 'unknown server error';
          if (res.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const { data } = res.response;
            console.log('response', data);
            let json_resp = null;
            try {
              json_resp = JSON.parse(data);
            } catch (e) {
              error = 'server error and unable to parse error response';
            }
            if (json_resp) {
              error = json_resp.message || 'unknown server error';
            }
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', res);
            error = res.message;
          }
          reject(new Error(error));
        });
    })
  ),
);


const isEmptyMap = (mapObject) => {
  for (const key in mapObject) {
    if (mapObject.hasOwnProperty(key)) return false;
  }
  return true;
};


const AuthorLoader = ({ name, classes }) => {
  const { display_name: displayName, description, avatar } = authorResource.read(name);
  let avatarNode = null;
  if (avatar) {
    const { default: defaultSrc } = avatar;
    const sizedAvatar = { ...avatar };
    delete sizedAvatar.default;
    const srcsetInfo = Object.keys(sizedAvatar).map((size) => {
      const url = sizedAvatar[size];
      return `${url} ${size}`;
    });
    let srcset = null;
    if (srcsetInfo.length > 0) {
      srcset = srcsetInfo.join(', ');
    }
    avatarNode = <img src={defaultSrc} srcSet={srcset} className={classes.avatarImg} />;
  }

  return (
    <div className={classes.mainLayout}>
      { avatarNode }
      <div className={classes.intro}>
        <h6 className={classes.displayName}>{displayName}</h6>
        <div className={classes.description} dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </div>
  );
};


const Author = ({ name, classes }) => (
  <Suspenser fallback={<LinearProgress color="secondary" />}>
    <AuthorLoader name={name} classes={classes} />
  </Suspenser>
);


const styles = {
  mainLayout: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    padding: '0 10px 0 10px',
    'font-size': '1.3rem',
    'font-weight': '300',

    display: 'flex',
    flexDirection: 'row',
  },

  avatarImg: {
    width: '30%',
    height: '100%',
    borderRadius: '50%',
    // border: '#d8d8d8 solid 1px',
  },

  intro: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  displayName: {
    fontSize: '24px',
    fontWeight: 600,
    margin: 0,
  },

  description: {

  },
};


export default withStyles(styles)(Author);
