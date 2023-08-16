import { PropsWithChildren } from 'react';
import parse, { type DOMNode, domToReact, attributesToProps, type HTMLReactParserOptions } from 'html-react-parser';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
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



import type { FigureConfig } from '~/Utils/Types';

import useTheme from '@mui/material/styles/useTheme';
import Paper from '@mui/material/Paper';
import Style from "./index.scss";
import PygmentsLightStype from "./PygmentsLight.css";
import PygmentsDarkStype from "./PygmentsDark.css";
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { styled } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import BlockQuote from './BlockQuote';
import AReplace from './AReplace';

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
            {
                const imgInfo: Element = childChildren
                    .map(each => each as Element)
                    .filter(({attribs}) => attribs)
                    .find(({ name: eachChildInA }) => eachChildInA === 'img');
                figureConfig.enlargeUrl = childAttribs.href;
                // figureConfigs.imgSrc = imgInfo.attribs.src;
                figureConfig.imgInfo = imgInfo;
            }
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

const preConfig: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {

        const theme = useTheme();

        const highlightStyle = theme.palette.mode === 'dark' ? PygmentsDarkStype : PygmentsLightStype;

        const {
            type: _, name, attribs, children,
        } = domNode as Element;
        if(name === 'span' && attribs.class) {
            // console.log(`${attribs.class}; ${highlightStyle[attribs.class]}`);
            return <span className={highlightStyle[attribs.class]}>{domToReact(children)}</span>
        }
        return null;
    }
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
    //   backgroundColor: theme.palette.common.black,
    //   color: theme.palette.common.white,
        backgroundColor: theme.palette.background.paper,
    },
    // [`&.${tableCellClasses.body}`]: {
    //   fontSize: 14,
    // },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
    '&:hover': {
        backgroundColor: theme.palette.action.selected,
    }
}));

const tableConfig: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
        const {
            type: _, name, attribs, children,
        } = domNode as Element;
        const props = attributesToProps(attribs);
        if(name === 'thead') {
            return <TableHead {...props}>{domToReact(children, tableConfig)}</TableHead>
        }
        if(name === 'tbody') {
            return <TableBody {...props}>{domToReact(children, tableConfig)}</TableBody>
        }
        if(name === 'tr') {
            return <StyledTableRow {...props}>{domToReact(children, tableConfig)}</StyledTableRow>;
        }
        if(name === 'th' || name === 'td') {
            return <StyledTableCell {...props} component={name}>{domToReact(children, tableConfig)}</StyledTableCell>
        }
        // if(name === 'td') {
        //     return <StyledTableCell {...props}>{domToReact(children, tableConfig)}</StyledTableCell>
        // }

        return null;
    }
}


const nodeReplace = (domNode: DOMNode, mediaList: FigureConfig[], onImageClick: (index: number) => void): false | void | object | Element => {

    const theme = useTheme();

    const {
        type: _, name, attribs, children,
    } = domNode as Element;

    if(!attribs) {
        return;
    }

    const elementChildren = children
        .map(each => each as Element)
        .filter(({attribs}) => attribs);

    if(name === 'figure' && attribs && attribs.class && attribs.class.includes('plugin-blockquote')) {
        return <BlockQuote element={domNode as Element} />;
    }
    if (name === 'figure') {
        const figureConfig = retriveFigure(elementChildren);

        // console.log('figure:', figureConfig);
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

        return <Grid container sm={Math.floor(12 / sm)} md={Math.floor(12 / md)} lg={Math.floor(12 / lg)}>
            {elementChildren.map(({ children: eachChild }: Element) => {
                const eachElementChildren = eachChild
                    .map(each => each as Element)
                    .filter(({attribs}) => attribs);
                const figureConfig = retriveFigure(eachElementChildren);
                // console.log('imageItemConfig=', figureConfig);
                const mediaCount = mediaList.length;
                mediaList.push(figureConfig);
                return <EnlargeClick {...figureConfig} onImageClick={() => onImageClick(mediaCount)} key={figureConfig.imgInfo.attribs.src}>
                    <ImageListItem>
                        {domToReact([figureConfig.imgInfo])}
                        <ImageListItemBar
                            title={domToReact([figureConfig.figCaptionInfo])}
                        />

                    </ImageListItem>
                </EnlargeClick>;
            })}
        </Grid>;
    }
    if (name === 'hr') {
        return <Divider />;
    }
    if (attribs && attribs.class && attribs.class.includes('plugin-button')) {
        const hasCenter = name === 'center';
        const linkNode = (hasCenter ? children[0] : domNode) as Element;
        const { attribs: { href: linkHref } } = linkNode;
        const buttonNode = linkNode.children[0] as Element;
        const buttonText = (buttonNode.children[0] as Text).data;

        const buttonDom = <Button variant="contained" href={linkHref} target="_blank" rel="noreferrer">{buttonText}</Button>;

        return hasCenter
            ? <Box className={Style.hCenter}>{buttonDom}</Box>
            : buttonDom;
    }
    if(name === 'blockquote') {
        return <BlockQuote element={domNode as Element} />;
    }
    if (name === 'a') {
        return <AReplace domNode={domNode} option={null} />
        // const { href: linkHref = '#' } = attribs;
        // if (linkHref.startsWith('#')) {
        //     return <MuiLink {...attributesToProps(attribs)}>{domToReact(children)}</MuiLink>;
        // }
        // if (linkHref.startsWith('/')) {
        //     return <MuiLink to={linkHref} component={Link}>{domToReact(children)}</MuiLink>;
        // }
        // return <MuiLink {...attributesToProps(attribs)} target="_blank" rel="noreferrer">{domToReact(children)} <OpenInNewIcon fontSize="inherit" /></MuiLink>;
    }

    if (name == 'ruby') {
        return <ruby {...attributesToProps(attribs)} className={Style.ruby}>{domToReact(children)}</ruby>;
    }

    if(name === 'pre') {
        return <Paper {...attributesToProps(attribs)} component="pre" variant="outlined" className={Style.hScroll} sx={{padding: theme.spacing(1)}}>{domToReact(children, preConfig)}</Paper>;
    }
    if(name === 'code') {
        return <code {...attributesToProps(attribs)} className={Style.code} style={theme.article.code}>{domToReact(children)}</code>;
    }
    if(name === 'table') {
        return <TableContainer className={Style.hScroll}>
            <Table {...attributesToProps(attribs)}>{domToReact(children, tableConfig)}</Table>
        </TableContainer>;
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
