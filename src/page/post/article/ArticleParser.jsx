import React from 'react';
import parse, { domToReact } from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import {
  Link,
} from 'react-router-dom';

// const EnlargeClick = ({enlargeUrl, children}) => enlargeUrl
//   ? <a href={enlargeUrl} target="_blank">{children}</a>
//   : children;

const EnlargeClick = ({ enlargeUrl, children, onImageClick }) => (enlargeUrl
  ? <>
    <a
      href={enlargeUrl}
      target="_blank"
      onClick={(evt) => { evt.preventDefault(); onImageClick(); }}
      style={{ textDecoration: 'inherit', color: 'inherit' }}
      rel="noreferrer"
    >
      {children}
    </a>
  </>
  : children);

const retriveFigure = (children) => {
  const figureConfig = {};
  children.forEach((nodeInfo) => {
    const { name: childName, attribs: childAttribs, children: childChildren } = nodeInfo;
    switch (childName) {
      case 'a':
        const imgInfo = childChildren.find(({ name: eachChildInA }) => eachChildInA === 'img');
        figureConfig.enlargeUrl = childAttribs.href;
        // figureConfigs.imgSrc = imgInfo.attribs.src;
        figureConfig.imgInfo = imgInfo;
        break;
      case 'img': // this disables the enlarge, e.g. an image button
        figureConfig.enlargeUrl = null;
        // figureConfigs.imgSrc = childAttribs.src;
        figureConfig.imgInfo = nodeInfo;
        break;
      case 'figcaption':
        figureConfig.figCaptionInfo = nodeInfo;
        break;
      default:
        console.error(nodeInfo);
        return null;
    }
  });
  return figureConfig;
}

const nodeReplace = (node, mediaList, onImageClick, breakpoints) => {
  // console.log(type, name, attribs, children);
  // return null;
  const {
    type, name, attribs, children,
  } = node;
  if (name === 'figure') {
    const figureConfig = retriveFigure(children);

    console.log('figure:', figureConfig);
    // console.log(`figure imgInfo:`, domToReact(figureConfigs.imgInfo, {}));
    const mediaCount = mediaList.length;
    const result = (
      <figure style={{textAlign: 'center'}}>
        <EnlargeClick {...figureConfig} onImageClick={() => onImageClick(mediaCount)}>
          {domToReact([figureConfig.imgInfo])}
          {figureConfig.figCaptionInfo && (
          <figcaption>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              {domToReact(figureConfig.figCaptionInfo.children, {})}
            </Typography>
          </figcaption>
          )}
        </EnlargeClick>
      </figure>
    );
    // console.log(`figure result:`, result);
    mediaList.push(figureConfig);
    return result;
  }
  else if (name === 'div' && attribs.class && attribs.class.includes('plugin-image-list')) {
    const {sm, md, lg} = JSON.parse(attribs['data-config']);

    let cols = sm;
    if (breakpoints.lg && lg) {
      cols = lg;
    } else if (breakpoints.md && md) {
      cols = md;
    }

    if(children.length < cols) {
      cols = children.length;
    }
    // console.log(`imageListConfig=`, imageListConfig);
    return <ImageList cols={cols}>
      {children.map(({children: eachChild}) => {
        const figureConfig = retriveFigure(eachChild);
        console.log(`imageItemConfig=`, figureConfig);
        const mediaCount = mediaList.length;
        mediaList.push(figureConfig);
        return <EnlargeClick {...figureConfig} onImageClick={() => onImageClick(mediaCount)} key={figureConfig.imgInfo.attribs.src}>
          <ImageListItem>

              {domToReact([figureConfig.imgInfo])}
              <ImageListItemBar
                title={domToReact([figureConfig.figCaptionInfo])}
              />

          </ImageListItem>
        </EnlargeClick>
      })}
    </ImageList>;
  }
  else if (name === 'hr') {
    return <Divider />;
  }
  else if (name === 'a') {
    const { href: linkHref = '#' } = attribs;
    if (linkHref.startsWith('#')) {
      return null;
    }
    if (linkHref.startsWith('/')) {
      return <Link to={linkHref}>{domToReact(children)}</Link>;
    }
    return domToReact([{ ...node, attribs: { ...attribs, target: '_blank' } }]);
  }

  return null;
};

export default ({ html, onImageClick, breakpoints }) => {
  const mediaList = [];
  const parseResult = parse(html, {
    replace: (each) => nodeReplace(each, mediaList, onImageClick, breakpoints),
  });

  return { parseResult, mediaList };
};
