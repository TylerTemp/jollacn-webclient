import Divider from "@mui/material/Divider";
import CommentAdd from "./CommentAdd";
import CommentList from "./CommentList";
import { useState } from "react";
import { type Comment } from "~/Utils/Types";
import Stack from "@mui/material/Stack";

interface Props {
    uri: string,
}

export default ({uri}: Props) => {

    const [preListComments, setPreListComments] = useState<Comment[]>([]);

    return <Stack gap={1}>
        <CommentAdd uri={uri} onAdd={comment => setPreListComments(old => [comment, ...old])} />
        <CommentList uri={uri} key={preListComments.length}/>
    </Stack>;
}
