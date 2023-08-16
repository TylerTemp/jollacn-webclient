import Stack from "@mui/material/Stack";
import { PropsWithChildren, useEffect, useState } from "react";
import { PostInfo } from "~/Utils/Types";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/Components/AlertSimple";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Link, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Paging from "~/Components/Paging";
import Box from "@mui/material/Box";
import Style from "./PostListPage.css";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
// import MoreIcon from '@mui/icons-material/More';
import ReadMoreTwoToneIcon from '@mui/icons-material/ReadMoreTwoTone';
import NoStyleLink from "~/Utils/NoStyleLink.scss";
import useTheme from "@mui/material/styles/useTheme";


const PostPreview = ({
    post: {
        cover, title, description, slug,
    }, page,
}: {post: PostInfo, page: number}) => {

    const { pathname } = useLocation();
    const isPostPath = pathname.startsWith('/post');

    return <Link
        className={NoStyleLink.link}
        to={isPostPath? slug :`/post/${slug}`}
        state={{ page }}
        id={slug}
    >
        <Card sx={{ width: '100%' }}>
            {cover && <>
                <CardMedia
                    component="img"
                    image={cover}
                    title={title} />
            </>}
            <CardContent>
                <Typography gutterBottom variant="h2">
                    {title}
                </Typography>
                <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
            </CardContent>
            <CardActions>
                <Button size="small" color="primary" startIcon={<ReadMoreTwoToneIcon />}>
                    阅读
                </Button>
            </CardActions>
        </Card>
    </Link>;
};

const PostSkeleton = () => <Card sx={{ width: '100%' }}>
    <CardMedia>
        <Skeleton variant="rectangular" height={300} />
    </CardMedia>
    <CardContent>
        <Typography gutterBottom variant="h2">
            <Skeleton variant="text"/>
        </Typography>
        <Typography component="div">
            <Skeleton variant="text"/>
            <Skeleton variant="text"/>
            <Skeleton variant="text"/>
        </Typography>
    </CardContent>
    <CardActions>
        <Skeleton width={50} height={30}/>
    </CardActions>
</Card>;

interface ApiResult {
    total: number,
    limit: number,
    post_infos: PostInfo[],
}

interface Props {
    page: number,
    onPageChange: (page: number) => void,
    loading: boolean,
    setLoading: (value: boolean) => void,
}


export default ({page, onPageChange, loading, setLoading, children}: PropsWithChildren<Props>) => {
    const [limit, setLimit] = useState<number>(10);
    const offset = (page - 1) * limit;
    const [preOffset, setPreOffset] = useState<number>(offset);

    const qs = new URLSearchParams({
        offset: `${offset}`,
        limit: `${limit}`,
    }).toString();

    const {loading: innerLoading, error, data: apiResult, reloadCallback} = useFetch<ApiResult>(`/post?${qs}`, {
        limit,
        total: 0,
        post_infos: []
    });

    // console.log(`postList ${apiResult.post_infos.length}, ${error}`);

    useEffect(() => {
        if(apiResult.limit != limit) {
            setLimit(limit);
        }
    }, [apiResult]);
    useEffect(() => {
        setLoading(innerLoading);
        if(!innerLoading) {
            setPreOffset(offset);
            window.scrollTo(0, 0);
        }
        // console.log(`loading: ${innerLoading}`)
    }, [innerLoading]);
    // console.log(`loading out: ${innerLoading}`)
    // useEffectNoFirstRender(() => reloadCallback(), [page]);

    // loading = true;
    // apiResult.post_infos = [];
    const theme = useTheme();

    return <>
        <Stack direction="column" gap={2}>
            {error && <AlertSimple
                severity="error"
                onReload={reloadCallback}
            >{error.message}</AlertSimple>}

            <Grid container spacing={2}>
                {apiResult.post_infos.map((each) => <Grid key={each.slug} sm={12} md={6}>
                    <PostPreview post={each} page={page} />
                </Grid>)}
            </Grid>
            {loading && apiResult.post_infos.length === 0 && <Grid container spacing={2}>
                {Array.from(Array(limit).keys()).map(index => <Grid key={index} sm={12} md={6}>
                    <PostSkeleton key={index} />
                </Grid>)}
            </Grid>}

            <Box className={Style.pagingContainer}>
                <Paper style={{padding: `${theme.spacing(0.5)} 0`}}>
                    <Paging
                        offset={preOffset}
                        willOffset={offset}
                        limit={limit}
                        total={apiResult.total}
                        onOffsetChange={newOffset => onPageChange(Math.floor(newOffset / limit) + 1)}
                    />
                </Paper>
            </Box>

        </Stack>
        {children}
    </>
}
