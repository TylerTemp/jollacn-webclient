import React, { Component } from 'react';
import {
  Link,
} from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
// import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

import classNames from 'classnames';
import { UniversalStyle as Style } from 'react-css-component';

import Lightbox from 'lightbox-react';
import 'lightbox-react/style.css';


const styles = theme => ({
  tieContent: {
    'font-size': '1.1rem',
  },
  muteLink: {
    color: 'inherit',
    'text-decoration': 'inherit',
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
class TieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      media_viewer_is_open: false,
      media_index: 0,
      media_viewer_content: '',
      media_viewer_medias: [],
    };
  }

  // TODO: video media?
  makeMediaPreview(previews, classes) {
    // console.log('previews:', previews);
    // previews.map((preview, _index) => {
    //   console.log(`${preview["type"]}, ${preview["src"]}`)
    // })

    const preview_length = previews.length;

    if (preview_length == 0) {
      return null;
    }

    if (preview_length == 1) {
      const tile = previews[0];
      return (
        <GridList cellHeight={200} cols={1}>
          <GridListTile key={tile.src}>
            { tile.type == 'video_poster' && <PlayCircleOutlineIcon classes={{ root: classNames(classes.absoluteCenter, classes.playBtn) }} />}
            <img src={tile.src} />
          </GridListTile>
        </GridList>
      );
    } if (preview_length == 2) {
      return (
        <GridList cellHeight={200} cols={2} spacing={1}>
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
      <GridList cellHeight={100} cols={rest_tile.length} spacing={1}>
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

  openMediaViewer(content, medias) {
    // console.log('media view tie', tie);
    // tie.map((key, value) => {
    //   console.log(key, value);
    // })
    // console.log(tie.content)
    this.setState({
      media_viewer_is_open: true,
      media_index: 0,
      media_viewer_content: content,
      media_viewer_medias: medias,
    });
  }

  render() {
    // console.log(this.props);

    const { classes } = this.props;

    if (this.props.error) {
      return (
        <div>
          <p>
ERROR:
            { this.props.error }
          </p>
        </div>
      );
    }
    if (!this.props.loaded) {
      return (
        <div>
          <p>loading...</p>
        </div>
      );
    }

    const {
      media_index, media_viewer_is_open, media_viewer_content, media_viewer_medias,
    } = this.state;

    const media_srcs = media_viewer_medias.map((media) => {
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

    for (let index = 0; index < media_viewer_medias.length; index++) {
      const current_media = media_viewer_medias[index];
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
        <Grid container spacing={24}>
          {
              this.props.ties.map((tie, index) => (
                <React.Fragment key={tie.id}>
                  <Grid item xs={12 / 1} md={12 / 3} lg={12 / 4}>
                    <Card>
                      <CardActionArea onClick={() => { this.openMediaViewer(tie.content, tie.medias); }}>
                        { this.makeMediaPreview(tie.media_previews, classes) }
                      </CardActionArea>
                      <Link
                        className={classes.muteLink}
                        to={{
                          pathname: `/tie/${tie.id}`,
                          state: { modal: true, modal_tie: true, return_to: this.props.location.pathname },
                        }}
                      >
                        <CardActionArea>
                          <CardContent>
                            <div className={classes.tieContent} dangerouslySetInnerHTML={{ __html: tie.content }} />
                          </CardContent>
                        </CardActionArea>
                      </Link>
                    </Card>
                  </Grid>
                </React.Fragment>
              ))
            }
        </Grid>

        {
            media_viewer_is_open && (
              <React.Fragment>
                <Style css={lightbox_css} />
                <Lightbox
                  reactModalStyle={{
                    overlay: {
                      zIndex: 2000,
                    },
                  }}
                  enableZoom={media_viewer_medias[media_index].type == 'img'}
                  imageCaption={media_viewer_medias[media_index].type == 'img' && <div dangerouslySetInnerHTML={{ __html: media_viewer_content }} />}
                  imageTitle={media_viewer_medias[media_index].title || media_viewer_medias[media_index].alt || false}
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


export default TieList;
