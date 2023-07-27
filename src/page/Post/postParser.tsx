import React, { PropsWithChildren } from 'react';
import parse, { type DOMNode, domToReact } from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import {
    Element,
    Text
    // ChildNode
} from 'domhandler';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import {
  Link,
} from 'react-router-dom';
import type { FigureConfig } from '~/Utils/Types';

// const EnlargeClick = ({enlargeUrl, children}) => enlargeUrl
//   ? <a href={enlargeUrl} target="_blank">{children}</a>
//   : children;

interface EnlargeClickProps {
    enlargeUrl: string,
    onImageClick: () => void,
}

const EnlargeClick = ({ enlargeUrl, onImageClick, children }: PropsWithChildren<EnlargeClickProps>) => (enlargeUrl
    ? <a
        href={enlargeUrl}
        target="_blank"
        onClick={(evt) => { evt.preventDefault(); onImageClick(); }}
        style={{ textDecoration: 'inherit', color: 'inherit' }}
        rel="noreferrer"
    >
        {children}
    </a>
  : children);

const retriveFigure = (children: Element[]) => {
  const figureConfig: FigureConfig = {
    enlargeUrl: null,
    imgInfo: null,
    figCaptionInfo: null,
  };

  children.forEach((nodeInfo) => {
    const { name: childName, attribs: childAttribs, children: childChildren } = nodeInfo;
    switch (childName) {
      case 'a':
        const imgInfo: Element = childChildren
            .filter(each => each instanceof Element)
            .map(each => each as Element)
            .find(({ name: eachChildInA }) => eachChildInA === 'img');
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
};


const nodeReplace = (domNode: DOMNode, mediaList: FigureConfig[], onImageClick: (index: number) => void): false | void | object | Element => {
    // console.log(type, name, attribs, children);
    // return null;
    if(!(domNode instanceof Element && domNode.attributes)) {
        return null;
    }

    const {
        type: _, name, attribs, children,
    } = domNode as Element;

    const elementChildren = children
        .filter(each => each instanceof Element)
        .map(each => each as Element);

    if (name === 'figure') {
        const figureConfig = retriveFigure(elementChildren);

        console.log('figure:', figureConfig);
        if(figureConfig === null) {
            return domNode;
        }

        const mediaCount = mediaList.length;
        const result = <figure style={{ textAlign: 'center' }}>
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
        </figure>;
        // console.log(`figure result:`, result);
        mediaList.push(figureConfig);
        return result;
    }
    if (name === 'div' && attribs.class && attribs.class.includes('plugin-image-list')) {
        const { sm, md, lg } = JSON.parse(attribs['data-config']);

        // let cols = sm;
        // if (breakpoints.lg && lg) {
        //   cols = lg;
        // } else if (breakpoints.md && md) {
        //   cols = md;
        // }

        // if (children.length < cols) {
        //   cols = children.length;
        // }
        // console.log(`imageListConfig=`, imageListConfig);
        return <Grid container sm={Math.floor(12 / sm)} md={Math.floor(12 / md)} lg={Math.floor(12 / lg)}>
            {elementChildren.map(({ children: eachChild }: Element) => {
                const eachElementChildren = eachChild
                    .filter(each => each instanceof Element)
                    .map(each => each as Element);
                const figureConfig = retriveFigure(eachElementChildren);
                console.log('imageItemConfig=', figureConfig);
                const mediaCount = mediaList.length;
                mediaList.push(figureConfig);
                return (
                    <EnlargeClick {...figureConfig} onImageClick={() => onImageClick(mediaCount)} key={figureConfig.imgInfo.attribs.src}>
                    <ImageListItem>
                    {domToReact([figureConfig.imgInfo])}
                    <ImageListItemBar
                            title={domToReact([figureConfig.figCaptionInfo])}
                        />

                    </ImageListItem>
                        </EnlargeClick>
                );
            })}
        </Grid>;
    }
  if (name === 'hr') {
    return <Divider />;
  }
  if (attribs && attribs.class && attribs.class.includes('plugin-button')) {
    const hasCenter = name === 'center';
    const linkNode = hasCenter ? children[0] : domNode ;
    if(!(linkNode instanceof Element)) {
        return null;
    }
    // console.log(linkNode);

    const { attribs: { href: linkHref } } = linkNode;
    const buttonNode = linkNode.children[0] as Element;
    const buttonText = (buttonNode.children[0] as Text).data;

    const buttonDom = <Button variant="contained" href={linkHref} target="_blank">{buttonText}</Button>;

    return hasCenter
      ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>{buttonDom}</Box>
      : buttonDom;
  }
  if (name === 'a') {
    const { href: linkHref = '#' } = attribs;
    if (linkHref.startsWith('#')) {
      return null;
    }
    if (linkHref.startsWith('/')) {
      return <Link to={linkHref}>{domToReact(children)}</Link>;
    }
    // return domToReact([{ ...domNode , attribs: { ...attribs, target: '_blank' } }]);
    domNode.attribs.target = '_blank';
    return <>{domToReact([domNode])}</>;
  }

  return null;
};

export default ({ html, onImageClick }: {html: string, onImageClick: (index: number) => void}) => {
    const mediaList: FigureConfig[] = [];
    const parseResult = parse(html, {
        replace: (domNode: DOMNode) => nodeReplace(domNode, mediaList, onImageClick),
    });

    return { parseResult, mediaList };
};
