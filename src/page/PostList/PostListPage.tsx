import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { useEffect, useState } from "react";
import { PostInfo } from "~/Utils/Types";
import useEffectNoFirstRender from "~/Utils/useEffectNoFirstRender";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/component/AlertSimple";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Paging from "~/component/Paging";
import Box from "@mui/material/Box";
import Style from "./PostListPage.css";
import Paper from "@mui/material/Paper";


const PostPreview = ({
    post: {
      cover, title, description, slug,
    }, page,
  }: {post: PostInfo, page: number}) => (
  <Link
      to={`/post/${slug}`}
      state={{ page }}
    >
    <Card sx={{ width: '100%' }}>
      { cover && (
      <>
        <CardMedia
          component="img"
          image={cover}
          title={title}
        />
      </>
      )}
      <CardContent>
        <Typography gutterBottom variant="h2">
          { title }
        </Typography>
        <Typography component="div" dangerouslySetInnerHTML={{ __html: description }} />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          阅读 &gt;&gt;
        </Button>
      </CardActions>
    </Card>
  </Link>
  );

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


export default ({page, onPageChange, loading, setLoading}: Props) => {

    const [limit, setLimit] = useState<number>(10);
    const offset = (page - 1) * limit;

    const qs = new URLSearchParams({
        offset: `${offset}`,
        limit: `${limit}`,
    }).toString();

    const {loading: innerLoading, error, data: apiResult, reloadCallback} = useFetch<ApiResult>(`/post?${qs}`, {
        limit,
        total: 0,
        post_infos: []
    });

    useEffect(() => {
        if(apiResult.limit != limit) {
            setLimit(limit);
        }
    }, [apiResult]);
    useEffect(() => {
        setLoading(innerLoading);
    }, [loading]);
    useEffectNoFirstRender(() => reloadCallback(), [page]);

    // console.log(`offset`, offset, `limit`, limit, `total`, apiResult.total);

    return <>
        <Stack direction="column" gap={2}>
            {error && <AlertSimple
                severity="error"
                onReload={reloadCallback}
            />}

            <Grid container spacing={2}>
                {apiResult.post_infos.map((each) => <Grid key={each.slug} sm={12} md={6}>
                        <PostPreview post={each} page={page} />
                    </Grid>
                )}
            </Grid>

            <Box className={Style.pagingContainer}>
                <Paper>
                    <Paging
                        offset={offset}
                        limit={limit}
                        total={apiResult.total}
                        onOffsetChange={newOffset => onPageChange(Math.floor(newOffset / limit))}
                    />
                </Paper>
            </Box>
        </Stack>
    </>
}

