import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import { type Comment } from "~/Utils/Types";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/component/AlertSimple";
import Paging from "~/component/Paging";

interface Props {
    uri: string,
    // preList: Comment[],
}

interface ApiResult {
    total: number,
    limit: number,
    comments: Comment[],
}

interface ApiState {
    loading: boolean,
    error: Error | null,
}

export default ({ uri }: Props) => {

    // const [limit, setLimit] = useState<number>(10);
    const [offset, setOffset] = useState<number>(0);
    const [apiResult, setApiResult] = useState<ApiResult>({
        total: 0,
        limit: 10,
        comments: [],
    });

    const [apiState, setApiState] = useState<ApiState>({
        loading: false,
        error: null,
    });

    const fetchComment = (offset: number, limit: number) => {
        setApiState({
            loading: true,
            error: null,
        });

        const qs = new URLSearchParams({
            offset: `${offset}`,
            limit: `${limit}`,
        }).toString();

        ReqJsonToType<ApiResult>(`${uri}?${qs}`)
            .then((apiResult) => {
                setApiState({
                    loading: false,
                    error: null,
                });
                // setLimit(apiResult.limit);
                setApiResult(apiResult);
            })
            .catch((error) => setApiState({
                loading: false,
                error,
            }));
    }

    useEffect(() => {
        fetchComment(offset, apiResult.limit);
    }, []);

    return <>
        {apiState.error && <AlertSimple
            severity="error"
            onReload={() => fetchComment(offset, apiResult.limit)}
        >
            {apiState.error.message}
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

        {!apiState.loading && !apiState.error && apiResult.comments.length === 0 && <Divider>
            暂无评论
        </Divider>}

        {apiState.loading && apiResult.comments.length === 0 && Array.from(Array(apiResult.limit).keys()).map(index => <Skeleton key={index} />)}

        <Paging
            total={apiResult.total}
            offset={offset}
            limit={apiResult.limit}
            onOffsetChange={offset => {
                setOffset(offset);
                fetchComment(offset, apiResult.limit);
            }}
            onLimitChange={limit => fetchComment(offset, limit)}
        />
    </>;
}
