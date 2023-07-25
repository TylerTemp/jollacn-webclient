import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { type Comment } from "~/Utils/Types";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/component/AlertSimple";

interface Props {
    uri: string,
    preList: Comment[],
}

interface ApiResult {
    total: number,
    limit: number,
    comments: Comment[],
}

export default ({ uri, preList = [] }: Props) => {

    const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);

    const qs = new URLSearchParams({
        offset: `${offset}`,
        limit: `${limit}`,
    }).toString();

    const {loading, error, data: apiResult, reloadCallback} = useFetch<ApiResult>(`/post?${qs}`, {
        limit,
        total: 0,
        comments: []
    });

    return <>
        {error && <AlertSimple
            severity="error"
            onReload={reloadCallback}
        >
            {error.message}
        </AlertSimple>}
        <List sx={{ width: '100%' }}>
            {apiResult.comments.map(({
                    id, nickname, avatar, content, updated_at: updatedAt,
                }) => <ListItem key={id} alignItems="flex-start">
                    <ListItemAvatar>
                        <Avatar alt={nickname} src={`/api/${avatar}`} />
                    </ListItemAvatar>
                    <ListItemText
                    primary={nickname}
                    secondary={<>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            {content}
                        </Typography>

                        {updatedAt && <span style={{ paddingLeft: '10px' }}>
                            {' '}
                            [{updatedAt}]
                        </span>}

                    </>}
                    />
                </ListItem>
            )}
        </List>
    </>;
}