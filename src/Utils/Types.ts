
import { Element  } from 'domhandler';

export interface PostInfo {
    slug: string,
    title: string,
    cover: string,
    description: string,
}

export interface Post {
    title: string,
    headerimg: string,
    description: string,
    content: string,

    source_type: "translation" | null,
    source_url: string | null,
    source_title: string | null,
    source_authors: string[],
    author: string,
}

export interface Tie {
    id: number,
    media_previews: TieImg[],
    medias: (TieImg | TieVideo)[],
    content: string,  // html
    author: string,
}

export interface Author {
    // name: string,
    display_name: string,
    description: string,  // html
    avatar: {
        'default': string,
        [key: string]: string,
    }
}

export interface Comment {
    id: number,
    nickname: string,
    email: string,
    content: string,
    avatar: string,
    updated_at: string,
}

export interface DisplayableMedia {
    type: "img" | "video",
    src: string,
}

export interface TieImg {
    src: string,
}

export interface TieVideo {
    subtitles: string[],
    sources: {
        src: string,
        mine: string,
        subtitled: boolean,
    }[],
}

export interface FigureConfig {
    enlargeUrl: string | null,
    imgInfo: Element | null,
    figCaptionInfo: Element | null,
}
