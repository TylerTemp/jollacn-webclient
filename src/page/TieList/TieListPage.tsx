import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import { PropsWithChildren, useEffect, useState } from "react";
import { DisplayableMedia, Tie } from "~/Utils/Types";
import useEffectNoFirstRender from "~/Utils/useEffectNoFirstRender";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/component/AlertSimple";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Link, useLocation } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Paging from "~/component/Paging";
import Box from "@mui/material/Box";
import Style from "./TieListPage.scss";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { WidthLimit } from "~/component/Layouts/WidthLimitLayout";
import useTheme from "@mui/material/styles/useTheme";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import CardActionArea from "@mui/material/CardActionArea";
import styled from "@mui/material/styles/styled";

interface MakeMediaPreviewProps {
    previews: DisplayableMedia[],
}

const MakeMediaPreview = ({ previews }: MakeMediaPreviewProps) => {
    if (previews.length === 0) {
      return null;
    }

    const cuttedPreviews = previews.slice(0, 3);

    if (cuttedPreviews.length === 1) {
        return <ImageList variant="quilted" cols={1} rowHeight={200} sx={{ margin: 0 }}>
            <ImageListItem key={cuttedPreviews[0].src} cols={1} rows={1}>
                <img src={cuttedPreviews[0].src} />
            </ImageListItem>
        </ImageList>;
    }

    return <ImageList variant="quilted" cols={2} rowHeight={200} sx={{ margin: 0 }}>
        {cuttedPreviews.map(({ src }, index) => <ImageListItem
            key={src}
            cols={(index === 0 || (index === 1 && cuttedPreviews.length === 2)) ? 2 : 1}
            rows={1}
        >
            <img src={src} />
        </ImageListItem>)}
    </ImageList>;
}

const TieContainer = ({children}: PropsWithChildren) => <Box className={Style.flowItem}>
    <Card>
        {children}
    </Card>
</Box>;

const FlowBox = styled(Box)(({theme}) => ({
    [theme.breakpoints.down('md')]: {
        columnCount: 1,
    },
    [theme.breakpoints.up('md')]: {
        columnCount: 4,
    },
    [theme.breakpoints.up('lg')]: {
        columnCount: 5,
    },
}));

interface ApiResult {
    total: number,
    limit: number,
    ties: Tie[],
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

    const qs = new URLSearchParams({
        offset: `${offset}`,
        limit: `${limit}`,
    }).toString();

    const {loading: innerLoading, error, data: apiResult, reloadCallback} = useFetch<ApiResult>(`/tie?${qs}`, {
        limit,
        total: 0,
        ties: []
    });

    useEffect(() => {
        if(apiResult.limit != limit) {
            setLimit(limit);
        }
    }, [apiResult]);

    useEffect(() => {
        setLoading(innerLoading);
    }, [innerLoading]);
    useEffectNoFirstRender(() => reloadCallback(), [page]);

    const theme = useTheme();
    const bgColor = theme.palette.background.default;

    return <WidthLimit maxWidth="xl">
        <Stack direction="column" gap={2}>

            {error && <AlertSimple
                severity="error"
                onReload={reloadCallback}
            />}

            {/* <Grid container spacing={2}> */}
            <FlowBox className={Style.flow}>
                {apiResult.ties.map(({
                    id, content, medias: _, media_previews: mediaPreviews,
                }) => <TieContainer key={id}>
                    <CardActionArea onClick={() => console.log(`card clicked`)}>
                        <MakeMediaPreview previews={mediaPreviews} />
                    </CardActionArea>
                    <Link
                        to={`/tie/${id}`}
                    >
                        <CardActionArea>
                            <CardContent>
                                <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: content }} />
                            </CardContent>
                        </CardActionArea>
                    </Link>
                </TieContainer>)}
            </FlowBox>
            {/* </Grid> */}

            {loading && apiResult.ties.length === 0 && <FlowBox className={Style.flow}>
                {Array.from(Array(limit).keys()).map(index => <TieContainer key={index}>
                    <Skeleton />
                </TieContainer>)}
            </FlowBox>}

            <Box className={Style.pagingContainer}>
                <Paper>
                    <Paging
                        offset={offset}
                        limit={limit}
                        total={apiResult.total}
                        onOffsetChange={newOffset => onPageChange(Math.floor(newOffset / limit) + 1)}
                    />
                </Paper>
            </Box>

        </Stack>

        {children && <Box className={Style.overlay} style={{backgroundColor: bgColor}}>
            <WidthLimit>
                {children}
            </WidthLimit>
        </Box>}
    </WidthLimit>;
}
