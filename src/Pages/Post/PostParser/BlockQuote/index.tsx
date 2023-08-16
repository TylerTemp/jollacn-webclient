import { type DOMNode, domToReact, attributesToProps, type HTMLReactParserOptions } from 'html-react-parser';
import {
    Element,
    // ChildNode
} from 'domhandler';
import Box from '@mui/material/Box';
import Style from "./index.scss";
import AReplace from '../AReplace';

const blockQuoteConfig: HTMLReactParserOptions = {
    replace: (domNode: DOMNode) => {
        const {
            type: _, name, attribs, children,
        } = domNode as Element;
        const props = attributesToProps(attribs);
        if(name === 'small') {
            return <Box {...props} className={Style.small}>{domToReact(children, blockQuoteConfig)}</Box>
        }

        if(name === 'a') {
            return <AReplace domNode={domNode} option={blockQuoteConfig}/>;
        }

        if(name === 'figcaption') {
            return <figcaption {...props} className={Style.small}>{domToReact(children, blockQuoteConfig)}</figcaption>
        }

        return null;
    }
}

export default ({element: {
    type: _type, name, attribs, children,
}} : {element: Element}): null | JSX.Element => {
    // console.assert(name === 'blockquote');
    switch(name) {
        case 'blockquote':
            return <blockquote {...attributesToProps(attribs)} className={Style.blockquote}>{domToReact(children, blockQuoteConfig)}</blockquote>
        case 'figure':
            return <figure {...attributesToProps(attribs)} className={Style.blockquote}>{domToReact(children, blockQuoteConfig)}</figure>
        default:
            return null;
    }
}
