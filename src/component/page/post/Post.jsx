import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { unstable_createResource as createResource } from 'react-cache';
import axios from 'axios';
// import { Parser as HtmlParser } from 'htmlparser2';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import assert from 'assert';
import classNames from 'classnames';

import Suspenser from '~/component/Suspenser';
import LightWrapper, { lightWrapperOpen } from './LightWrapper';
import Author from './Author';


import '~/css/post.css';

const postResource = createResource(
  slug => (
    new Promise((resolve, reject) => {
      axios.get(`/api/post/${slug}`, { transformResponse: undefined })
        .then((res) => {
          const { data } = res;
          const post = JSON.parse(data);
          resolve(post);
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
      // .then(() => {
      //   // console.log('always');
      //   this.setState({ loaded: true });
      // });
    })
  ),
);


const replaceVideoByBtn = ($btn, node) => {
  const $wrapper = $btn.parentElement.parentElement.childNodes;
  const $video = $wrapper[0];
  console.log(node.video);
  const $new_video = document.createElement('video');
  for (const key in node.video) {
    let value = node.video[key];
    if (value == '') {
      value = key;
    }
    $new_video[key] = value;
  }

  node.sources.map((attributes) => {
    const $source = document.createElement('source');
    for (const key in attributes) {
      $source[key] = attributes[key];
    }
    $new_video.appendChild($source);
  });

  // node.tracks.map(attributes => {
  //   const $track = document.createElement('track');
  //   for(let key in attributes) {
  //     $track[key] = attributes[key];
  //   };
  //   $new_video.appendChild($track);
  // });

  $new_video.addEventListener('loadedmetadata', function () {
    // console.log('loadedmetadata', node.tracks);
    node.tracks.map((attributes) => {
      // const $track = document.createElement('track');
      // for(let key in attributes) {
      //   $track[key] = attributes[key];
      // };
      // $new_video.appendChild($track);
      console.log('loadedmetadata', attributes.kind, attributes.label, attributes.srclang);
      console.log(this);
      this.addTextTrack(attributes.kind, attributes.label, attributes.srclang);
    });
    // track = this.addTextTrack("captions", "English", "en");
  });

  $video.parentNode.replaceChild($new_video, $video);

  const control_btn_area = $wrapper[1].childNodes;
  for (let index = 0; index < control_btn_area.length; index++) {
    const $elem = control_btn_area[index];
    // console.log($elem);
    // console.log($elem.tagName);
    if ($elem.tagName && $elem.tagName.toLowerCase() == 'button') {
      // console.log($elem.classList.contains('subtitle-switch-btn-active'));
      if ($elem.classList.contains('subtitle-switch-btn-active')) {
        $elem.classList.remove('subtitle-switch-btn-active');
      }
    }
  }
  $btn.classList.add('subtitle-switch-btn-active');
};


const parsePostHTML = (html) => {
  let plugin_children = [];
  let plugin_type = null;
  let plugin_config = {};

  const medias = [];

  const parser = new ReactHtmlParser(html, {
    transform: (node, index) => {
      if (node.type == 'comment' && node.data && node.data.startsWith(' START ')) {
        const comment = node.data;
        // console.log('comment', comment);
        const comment_split = comment.slice(' START '.length).split('=');
        const action = comment_split[0];
        if (['image_group'].indexOf(action) != -1) {
          plugin_type = 'image_group';
          const config_json = comment_split[1];
          // console.log('config_json', config_json);
          plugin_config = JSON.parse(config_json);
          console.log('plugin start', plugin_type, plugin_config);
        }
      } else if (node.type == 'comment' && node.data && node.data.startsWith(' END ')) {
        const comment = node.data;
        const action = comment.slice(' END '.length).trim();
        console.log('plugin end', action);
        assert.equal(action, plugin_type, `END action ${action} != START action ${plugin_type}`);

        const nodes = [];

        // alert(plugin_config['title']);

        plugin_children.map(({ node, index: this_index }) => {
          if (node.children[0].name == 'a' && node.children[0].children[0].name == 'img') {
            const big_img_src = node.children[0].attribs.href;
            const thumbnail_img_src = node.children[0].children[0].attribs.src;
            const attrs = { ...node.children[0].children[0].attribs, ...{ src: big_img_src } };
            if (plugin_config.title) {
              // console.log('find title!', node.next.next.children[0].children[0].data);
              // const title = node.next.next.children[0].data;
              attrs.title = node.next.next.children[0].children[0].data;
              // console.log()
            } else {
              delete attrs.title;
            }

            const current_index = medias.length;
            medias.push(attrs);

            nodes.push(
              <li key={this_index}>
                <a href={big_img_src} dataImgId={current_index} onClick={(evt) => { evt.preventDefault(); lightWrapperOpen(current_index); }}>
                  <figure className="thumbnail" dataImgId={current_index}>
                    <img src={thumbnail_img_src} alt={node.children[0].children[0].alt} />
                    { attrs.title && <figcaption className="am-thumbnail-caption">{ attrs.title }</figcaption> }
                  </figure>
                </a>
              </li>,
            );
          }
        });

        const old_plugin_config = { ...plugin_config };

        plugin_children = [];
        plugin_type = null;
        plugin_config = {};

        return (
          <ul className={`thumbnails thumbnails-avg-sm-${old_plugin_config.sm} thumbnails-avg-md-${old_plugin_config.md} thumbnails-avg-lg-${old_plugin_config.lg}`}>
            { nodes }
          </ul>
        );
      } else {
        if (plugin_type) {
          console.log('add child for', plugin_type, node);
          plugin_children.push({ node, index });
          return null;
        }
        // p -> a -> img block
        if (
          node.type == 'tag' && node.name == 'p'
            && node.children.length == 1 && node.children[0].type == 'tag' && node.children[0].name == 'a'
            && node.children[0].children.length == 1 && node.children[0].children[0].type == 'tag' && node.children[0].children[0].name == 'img'
        ) {
          const big_img_src = node.children[0].attribs.href;
          const thumbnail_img_src = node.children[0].children[0].attribs.src;
          console.log(`img block ${big_img_src}, thumbnail ${thumbnail_img_src}`);
          const current_index = medias.length;
          const attrs = { ...node.children[0].children[0].attribs, ...{ src: big_img_src } };
          medias.push(attrs);
          return (
            <a
              key={index}
              className="thumbnail-container"
              href={big_img_src}
              onClick={(evt) => {
                evt.preventDefault();
                // {# this.openMediaViewer(current_index); #}
                // console.log("FIX ME!");
                lightWrapperOpen();
              }}
            >
              <figure className="thumbnail" dataImgId={current_index}>
                <img src={thumbnail_img_src} alt={node.children[0].children[0].alt} />
              </figure>
            </a>
          );
        }
        // video
        if (node.type == 'tag' && node.name == 'video') {
          // return <p>视频!</p>
          console.log('video', node);
          const sources = node.children.filter(child => child.type == 'tag' && child.name == 'source');
          // console.log(sources);
          const first_source = sources[0];
          const first_src = first_source.attribs.src;
          const first_src_dot_parts = first_src.split('.');
          const first_ext = first_src_dot_parts.pop();
          const base_url = first_src_dot_parts.join('.');
          const search_alternative = [
            { key: 'zh_en', label: '中/英' },
            { key: 'en_zh', label: '英/中' },
            { key: 'en', label: '英语' },
            { key: 'zh', label: '中文' },
          ];

          const alternatives = [];
          // console.log('search_alternative', search_alternative);
          search_alternative.map(({ key, label }) => {
            const target_src = `${base_url}_${key}.${first_ext}`;
            sources.map((this_search_node) => {
              const { src } = this_search_node.attribs;
              if (src == target_src) {
                alternatives.push({
                  label,
                  key,
                  node: {
                    video: { ...node.attribs },
                    sources: [
                      { ...this_search_node.attribs },
                    ],
                    tracks: [
                    ],
                  },
                });
              }
            });
          });

          console.log('alternatives', alternatives, alternatives.length);
          if (alternatives.length > 0) {
            // alternatives.push({
            //   'label': '外挂字幕',
            //   'key': 'default',
            //   'node': {
            //     'video': {...node.attribs},
            //     'sources': sources.map(source_node => ({...source_node.attribs})),
            //     'tracks': node.children.filter(child => child.type == 'tag' && child.name == 'track').map(track_node => ({...track_node.attribs})),
            //   },
            // });

            // has bug

            const video_ref = React.createRef();

            return (
              <div key={index} className="video-wrapper">
                { convertNodeToElement(node, `video-${index}`) }
                <div className="video-subtitle-control-container">
                  字幕不显示或者太丑点我: &nbsp;
                  { alternatives.map(({ label, node: this_node, key: btn_key }, this_index) => {
                    const this_ref = this;
                    return (
                      <button
                        key={`video-btn-${index}-${this_index}`}
                        className={classNames({ 'subtitle-switch-btn': true, 'subtitle-switch-btn-active': btn_key == 'default', [btn_key]: true })}
                        onClick={
                            (evt) => {
                              evt.preventDefault();
                              replaceVideoByBtn(evt.nativeEvent.target, this_node);
                            }
                          }
                      >
                        { label }
                      </button>
                    );
                  }) }
                </div>
              </div>
            );
          }
        }
      }
    },
  });

  return { medias, dom: parser };
};


const PostBody = ({ slug, classes }) => {
  const postResult = postResource.read(slug);
  // alert(JSON.stringify(postResult));
  const {
    content, headerimg, title, description,
    source_type: sourceType,
    source_url: sourceUrl, source_title: sourceTitle,
    source_author: sourceAuthor
  } = postResult;
  // Author
  const { medias, dom: post_component } = parsePostHTML(content);

  const needDevider = (sourceAuthor || (
    sourceType === 'translation' && sourceUrl
  ));

  const sourceDisplay = sourceTitle || sourceUrl;

  return (
    <Fragment>
      <article className="post">
        <div>
          <img src={headerimg} className={classes.postHeaderImg} />
        </div>
        <div className={classes.postBox}>
          <Typography gutterBottom variant="title" component="h1" align="center" className={classes.postTitle}>
            {title}
          </Typography>
          <hr className={classes.postMetaBodyDivider} />
          {
          description && (
            <div className={classes.postDescription} dangerouslySetInnerHTML={{ __html: description }} />
          )
        }
          <div>
            { post_component }
          </div>
        </div>
      </article>
      { needDevider && <Divider />}
      { sourceAuthor && <Author name={ sourceAuthor} /> }
      { sourceUrl && <Fragment>
        <p className={classes.sourceBox}>原文: <a target="_blank" href={sourceUrl}>{sourceDisplay}</a></p>
      </Fragment>}
      <LightWrapper medias={medias} />
    </Fragment>
  );
};


const styles = {
  // paper: {
  //   'width': '100%',
  // },
  postBox: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    padding: '50px 10px 30px 10px',
    'font-size': '1.3rem',
    'font-weight': '300',
  },
  postHeaderImg: {
    width: '100%',
  },
  postTitle: {
    'font-size': '2.8rem',
    'line-height': '1.15',
    'font-weight': '400',
    'padding-bottom': '30px',
  },
  postMetaBodyDivider: {
    'border-color': '#eee',
    height: 0,
    'border-top': '1px solid #eee',
  },
  postDescription: {
    color: '#666',
    // 'font-size': '1.4rem',
    // 'line-height': '1',
    border: '1px solid #dedede',
    'border-radius': '2px',
    background: '#f9f9f9',
    padding: '0 10px 0 10px',
  },
  sourceBox: {
    'max-width': '900px',
    'margin-left': 'auto',
    'margin-right': 'auto',
    padding: '0 10px 30px 10px',
    'font-size': '1.3rem',
    'font-weight': '300',
  },
};

const Post = ({ slug, classes }) => (
  <Suspenser fallback={<LinearProgress />} onError={() => { <p>error</p>; }}>
    <PostBody slug={slug} classes={classes} />
  </Suspenser>
);

// export default Post;
export default withStyles(styles)(Post);
