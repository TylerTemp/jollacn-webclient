import {
  Link, useNavigate,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Fab from '@mui/material/Fab';
import ReadMoreIcon from '@mui/icons-material/ReadMore';

// import PostList from '~/page/PostList';
import PostListWrapper from '~/page/PostList/PostListWrapper';
import TieListPage from '~/page/TieList/TieListPage';
import { PropsWithChildren, useState } from 'react';
import useTheme from '@mui/material/styles/useTheme';
import styled from "@mui/material/styles/styled";

const TieBox = styled(Box)(({theme}) => ({
    display: 'flex',
    gap: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
        '& > :nth-child(n+3)': {
            display: 'none',
        }
    },
    [theme.breakpoints.down('sm')]: {
        '& > :nth-child(n+2)': {
            display: 'none',
        },
    },
}));

export default () => {

    const [tieLoading, setTieLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    // const theme = useTheme();
    // const breakLevel = if(theme.breakpoints.down('md'))

    return <>
        <Box sx={{ width: '100%', position: 'relative', marginBottom: '30px' }}>
            <TieListPage
                page={1}
                defaultLimit={3}
                disablePaging
                loading={tieLoading}
                setLoading={setTieLoading}
                onPageChange={page => page <= 1? navigate(`/tie`): navigate(`/tie/page/${page}`)}
                Container={({children}: PropsWithChildren) => <TieBox>{children}</TieBox>}
            />
            <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>
                <Link to="/tie">
                    <Fab color="primary" aria-label="add">
                        <ReadMoreIcon />
                    </Fab>
                </Link>
            </Box>
        </Box>

        {/* <Box height={30} /> */}

        <PostListWrapper page={1} />
    </>;
}
