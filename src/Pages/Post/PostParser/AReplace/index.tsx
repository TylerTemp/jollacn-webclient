import { type DOMNode, domToReact, attributesToProps, type HTMLReactParserOptions } from 'html-react-parser';
import {
    Element,
    // ChildNode
} from 'domhandler';
import MuiLink from '@mui/material/Link';
import { Link } from 'react-router-dom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export default ({domNode, option} : {domNode: DOMNode, option: HTMLReactParserOptions}): null | JSX.Element => {
    const { type: _type, name, attribs, children} = domNode as Element;
    if(name !== 'a') {
        return null;
    }

    const { href: linkHref = '#' } = attribs;
    if (linkHref.startsWith('#')) {
        return <MuiLink {...attributesToProps(attribs)}>{domToReact(children, option)}</MuiLink>;
    }
    if (linkHref.startsWith('/')) {
        return <MuiLink to={linkHref} component={Link}>{domToReact(children, option)}</MuiLink>;
    }
    return <MuiLink {...attributesToProps(attribs)} target="_blank" rel="noreferrer">{domToReact(children, option)} <OpenInNewIcon fontSize="inherit" /></MuiLink>;
}