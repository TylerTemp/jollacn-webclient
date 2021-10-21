import React from 'react';
import {
  Link,
} from 'react-router-dom';
import Box from '@mui/material/Box';

import BlogHeaderImg from '~/asset/image/blog_header.png';

import Header from './Header';
import Footer from './Footer';
import { HeaderImg } from './Style';

export default ({ children }) => (
  <>
    <Header at="home">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '40px',
          paddingBottom: '25px',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <Link to="/">
          <HeaderImg src={BlogHeaderImg} alt="Jolla非官方中文博客" />
        </Link>
      </Box>
    </Header>
    {children}
    <Footer />
  </>
);
