import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
// import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
// import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import classNames from 'classnames';
import { UniversalStyle as Style } from 'react-css-component';

import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';

import axios from 'axios';

import tieListCache from '~/component/storage/TieListCache';


const styles = theme => ({
  // pageWidthLimit: {
  //   width: 'auto',
  //   marginLeft: theme.spacing.unit * 3,
  //   marginRight: theme.spacing.unit * 3,
  //   [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
  //     width: 1100,
  //     marginLeft: 'auto',
  //     marginRight: 'auto',
  //   },
  // },
  tieContent: {
    fontSize: '1.5rem',
  },

  absoluteCenter: {
    margin: 'auto',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

  },
  playBtn: {
    'z-index': 1,
    'font-size': '100px',
    color: '#6fcaff',
    // 'box-shadow': '0px 0px 38px -1px rgba(0,0,0,0.75)',
    filter: 'drop-shadow(0px 0px 5px #c5c5c5)',
  },
  videoWrapper: {
    'text-align': 'center',
  },
  video: {
    // 'width': '100%',
    // 'height': '60%',
  },
});


@withStyles(styles)
class Tie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id || parseInt(this.props.match.params.id),
      loaded: this.props.loaded === undefined ? false : this.props.loaded,
      error: this.props.error === undefined ? null : this.props.error,
      tie: this.props.tie === undefined ? {
        content: null,
      } : this.props.tie,

      media_viewer_is_open: false,
      media_index: 0,
    };
  }

  componentDidMount() {
    this.fetchTie(this.state.id);
  }

  fetchTie(id) {
    const promise = new Promise((resolve, reject) => tieListCache.fetchTie(id, resolve, reject));

    this.setState({
      loaded: false,
      error: null,
      id,
    });

    promise.then(
      (tie) => {
        this.setState({ loaded: true, error: null, tie });
      },
      (error_msg) => {
        this.setState({ loaded: true, error: error_msg });
      },
    );
  }

  // TODO: video media?
  makeMediaPreview(previews, classes) {
    // console.log('previews:', previews);

    const preview_length = previews.length;

    if (preview_length == 0) {
      return null;
    }

    const oneCellHeight = 600;

    if (preview_length == 1) {
      const tile = previews[0];
      return (
        <React.Fragment>
          { tile.type == 'video_poster' && <PlayCircleOutlineIcon classes={{ root: classNames(classes.absoluteCenter, classes.playBtn) }} />}
          <img src={tile.src} width="100%" height="auto" style={{ width: '100%', height: 'auto', marginBottom: '-3px' }} />
        </React.Fragment>
      );
    } if (preview_length == 2) {
      return (
        <GridList cellHeight={oneCellHeight} cols={2} spacing={1}>
          {
          previews.map(tile => (
            <GridListTile key={tile.src}>
              { tile.type == 'video_poster' && <PlayCircleOutlineIcon classes={{ root: classNames(classes.absoluteCenter, classes.playBtn) }} />}
              <img src={tile.src} />
            </GridListTile>))
        }
        </GridList>
      );
    }
    const first_tile = previews[0];
    const rest_tile = previews.slice(1);
    return (
      <GridList cellHeight={oneCellHeight / 2} cols={rest_tile.length} spacing={1}>
        <GridListTile key={first_tile.src} cols={rest_tile.length} rows={1}>
          { first_tile.type == 'video_poster' && <PlayCircleOutlineIcon classes={{ root: classNames(classes.absoluteCenter, classes.playBtn) }} />}
          <img src={first_tile.src} />
        </GridListTile>
        {
          rest_tile.map(tile => (
            <GridListTile key={tile.src}>
              { tile.type == 'video_poster' && <PlayCircleOutlineIcon classes={{ root: classNames(classes.absoluteCenter, classes.playBtn) }} />}
              <img src={tile.src} />
            </GridListTile>))
        }
      </GridList>
    );
  }

  openMediaViewer() {
    // const old_media_viewer_is_open = this.state.media_viewer_is_open
    this.setState({ media_viewer_is_open: true });
  }

  render() {
    const { id, error, loaded } = this.state;
    const tie = this.props.tie || this.state.tie;
    const { classes } = this.props;

    if (error) {
      return (
        <div>
          <p>
ERROR:
            { error }
          </p>
        </div>
      );
    }

    if (!loaded) {
      return (
        <div>
          <p>tie loading...</p>
        </div>
      );
    }

    const { media_index } = this.state;

    const media_srcs = tie.medias.map((media) => {
      if (media.type == 'img') {
        return media.src;
      }
      return (
        <div className={classes.videoWrapper}>
          <video className={classes.video} controls crossOrigin="anonymous" poster={media.poster}>
            抱歉，你的浏览器不支持
            <code>video</code>
元素
            {
              media.sources.map(({ mime, src }, index) => (
                <source key={`${index}-${src}`} src={src} type={mime} />
              ))
            }
            {
              media.subtitles && media.subtitles.map((subtitle, index) => (
                <track
                  key={`${index}-${subtitle.src}`}
                  default={index == 0}
                  kind="subtitles"
                  label={subtitle.label}
                  src={subtitle.src}
                  srcLang={subtitle.srclang}
                />
              ))
            }
          </video>
        </div>
      );
    });

    let lightbox_css = `
    .ril-image-current {
      top: 0;
    }`;

    for (let index = 0; index < tie.medias.length; index++) {
      const current_media = tie.medias[index];
      if (current_media.type == 'video') {
        lightbox_css = `
          .ril-image-current {
            top: unset;
          }
        `;
        break;
      }
    }

    const media_count = media_srcs.length;

    return (
      <React.Fragment>
        <div className={classes.tieContent} dangerouslySetInnerHTML={{ __html: tie.content }} />
        {
          tie.medias.length > 0 && (
            <Card>
              <CardActionArea onClick={this.openMediaViewer.bind(this)}>
                { this.makeMediaPreview(tie.media_previews, classes) }
              </CardActionArea>
            </Card>
          )
        }
        {
          this.state.media_viewer_is_open && (
            <React.Fragment>
              <Style css={lightbox_css} />
              <Lightbox
                reactModalStyle={{
                  overlay: {
                    zIndex: 2000,
                  },
                }}
                enableZoom={tie.medias[media_index].type == 'img'}
                imageCaption={tie.medias[media_index].type == 'img' && <div dangerouslySetInnerHTML={{ __html: tie.content }} />}
                imageTitle={tie.medias[media_index].title || tie.medias[media_index].alt || false}
                mainSrc={media_srcs[media_index]}
                nextSrc={media_srcs[(media_index + 1) % media_count]}
                prevSrc={media_srcs[(media_index + media_count - 1) % media_count]}
                onCloseRequest={() => this.setState({ media_viewer_is_open: false })}
                onMovePrevRequest={() => this.setState({
                  media_index: (media_index + media_count - 1) % media_count,
                })
                }
                onMoveNextRequest={() => this.setState({
                  media_index: (media_index + 1) % media_count,
                })
                }
              />
            </React.Fragment>
          )
        }
      </React.Fragment>
    );
  }
}


export default Tie;
