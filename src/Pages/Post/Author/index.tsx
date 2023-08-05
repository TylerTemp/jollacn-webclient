// import Controller from './Controller';

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { PropsWithChildren, useMemo } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import { type Author } from "~/Utils/Types";
// import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import parse from 'html-react-parser';
import RetryErrorSuspense, { type RendererProps } from "~/Components/RetryErrorSuspense";

const ContentLayout = ({ children }: PropsWithChildren) => (
    <Box sx={{
        display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center',
    }}
    >
        <Box sx={{ maxWidth: '900px', width: '100%' }}>
            {children}
        </Box>
    </Box>
);

// interface RendererProps {
//     getAuthor: () => Author,
// }

const Renderer = ({getResource: getAuthor}: RendererProps<Author>) => {
    const {display_name: displayName, description, avatar} = getAuthor();

    const {default: _, ...avatarSet} = avatar;

    const avatarSets = Object.entries(avatarSet).map(([key, value]) => `${value} ${key}`);
    const avatarSetAttr = avatarSets.length === 0
        ? undefined
        : avatarSets.join(', ');

    return <Grid container spacing={2}>
        <Grid xs={12} md={3}>
            <Avatar
                alt={displayName}
                src={avatar.default}
                srcSet={avatarSetAttr}
                sx={{
                    width: '100%',
                    height: 'auto',
                }}
            />
        </Grid>
        <Grid xs={12} md={9}>
            <>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', padding: '20px 0px' }}>
                    {displayName}
                </Typography>
                <Typography variant="body1" sx={{ padding: '20px 0px' }} component="div">
                    {parse(description)}
                </Typography>
            </>
        </Grid>
    </Grid>;
}

interface Props {
    id: string
}

export default ({id}: Props) => {

    // const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    // const getAuthor = useMemo(
    //     () => Suspendable(
    //         ReqJsonToType<Author>(`/author/${id}`, {signal: doAbort()})
    //     ),
    //     [retryKey]);
    const makePromise = useMemo(() => {
        return (abortController: AbortController) => ReqJsonToType<Author>(`/author/${id}`, {signal: abortController.signal});
    }, [id]);


    return <ContentLayout>
        {/* <RetryErrorBoundary onRetry={doRetry}>
            <Suspense fallback={<>
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} width="80%" />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} width="80%" />
            </>}>
                <Renderer
                    key={retryKey}
                    getAuthor={getAuthor} />
            </Suspense>
        </RetryErrorBoundary> */}
        <RetryErrorSuspense<Author>
            noTrace
            makePromise={makePromise}
            fallback={<>
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} width="80%" />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} style={{ marginBottom: 5 }} />
                <Skeleton animation="wave" height={40} width="80%" />
            </>}
            renderer={Renderer}
        />
    </ContentLayout>;
}