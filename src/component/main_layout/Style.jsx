import styled from '@mui/system/styled';
import Tab from '@mui/material/Tab';
import {
  NavLink,
} from 'react-router-dom';

export const HeaderImg = styled('img')({
  width: '100%',
  maxWidth: '575px',
});


export const SNavLink = styled(NavLink)({
  textDecoration: 'none',
  color: 'inherit'
  // color: 'white',
});


export const STab = styled(Tab)({
  color: 'rgba(255, 255, 255, 0.7)',
  '&.Mui-selected': {
    color: '#fff',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
});

export default {
  HeaderImg,
  SNavLink,
  STab
};
