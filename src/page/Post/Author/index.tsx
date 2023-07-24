// import Controller from './Controller';

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { PropsWithChildren, Suspense, useMemo } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import Suspendable from "~/Utils/Suspendable";
import { type Author } from "~/Utils/Types";
import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import RetryErrorBoundary from "~/component/RetryErrorBoundary";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import parse, { domToReact } from 'html-react-parser';

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

interface RendererProps {
    getAuthor: () => Author,
}

const Renderer = ({getAuthor}: RendererProps) => {
    const {display_name: displayName, description, avatar} = getAuthor();

    const avatarSet = { ...avatar };
    delete avatarSet.default;
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
            <Typography variant="body1" sx={{ padding: '20px 0px' }}>
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

    const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    const getAuthor = useMemo(
        () => Suspendable(
            ReqJsonToType<Author>(`/author/${id}`, {signal: doAbort()})
        ),
        [retryKey]);


    return <ContentLayout>
        <RetryErrorBoundary onRetry={doRetry}>
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
        </RetryErrorBoundary>
    </ContentLayout>;
}