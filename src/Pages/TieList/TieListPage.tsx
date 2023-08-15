import Stack from "@mui/material/Stack";
import { PropsWithChildren, useEffect, useState } from "react";
import { DisplayableMedia, Tie } from "~/Utils/Types";
import useFetch from "~/Utils/useFetch";
import AlertSimple from "~/Components/AlertSimple";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Paging from "~/Components/Paging";
import Box from "@mui/material/Box";
import Style from "./TieListPage.scss";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import styled from "@mui/material/styles/styled";
import useTheme from "@mui/material/styles/useTheme";
import NoStyleLink from "~/Utils/NoStyleLink.scss";

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

const TieContainer = ({children}: PropsWithChildren) => <FlowBox className={Style.flow}>
    {children}
</FlowBox>;


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
    Container?: (props: PropsWithChildren) => JSX.Element,
    disablePaging? : boolean,
    defaultLimit?: number,
}

export default ({page, onPageChange, loading, setLoading, Container=TieContainer, disablePaging=false, defaultLimit=15, children}: PropsWithChildren<Props>) => {
    const [limit, setLimit] = useState<number>(defaultLimit);
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

    const theme = useTheme();

    // loading = true;
    // apiResult.ties = [];

    return <>
        <Stack direction="column" gap={2}>

            {error && <AlertSimple
                severity="error"
                onReload={reloadCallback}
            >{error.message}</AlertSimple>}

            <Container>
                {apiResult.ties.map(({
                    id, content, medias: _, media_previews: mediaPreviews,
                }) => <Box key={id} className={Style.flowItem} style={{margin: `0 auto ${theme.spacing(2)}`}}>
                    <Link
                        className={NoStyleLink.link}
                        to={`${id}`}
                        state={{ page }}
                    >
                        <Card>
                            <MakeMediaPreview previews={mediaPreviews} />
                            <CardContent>
                                <Typography variant="body1" component="div" dangerouslySetInnerHTML={{ __html: content }} />
                            </CardContent>
                        </Card>
                    </Link>
                </Box>)}
            </Container>
            <Container>
                {loading && apiResult.ties.length === 0 && Array.from(Array(limit).keys()).map(index => <Box key={index} className={Style.flowItem} style={{margin: `0 auto ${theme.spacing(2)}`}}>
                    <Card>
                        <CardMedia sx={{ height: 140 }}>
                            <Skeleton variant="rectangular" sx={{ height: 140 }} className={Style.skeletonMedia} />
                        </CardMedia>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" />
                        <Skeleton />
                    </Card>
                </Box>)}
            </Container>

            {!disablePaging && <Box className={Style.pagingContainer}>
                <Paper style={{padding: `${theme.spacing(0.5)} 0`}}>
                    <Paging
                        lessThan2Page={null}
                        offset={offset}
                        limit={limit}
                        total={apiResult.total}
                        onOffsetChange={newOffset => onPageChange(Math.floor(newOffset / limit) + 1)}
                    />
                </Paper>
            </Box>}

        </Stack>

        {/* {children && <Fixed top={menuBarHeight} style={{backgroundColor: bgColor}}>
            <PageStruct className={Style.fixed}>
                <WidthLimit maxWidth="lg">
                    {children}
                </WidthLimit>
            </PageStruct>
        </Fixed>} */}
        {children}
    </>;
}
