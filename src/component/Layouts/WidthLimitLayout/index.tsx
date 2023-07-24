import { PropsWithChildren } from 'react';
import {
  Outlet,
} from 'react-router-dom';
import Box from '@mui/system/Box';
import Style from "./index.css";


export default ({children}: PropsWithChildren) => <Box className={Style.container}>
    <Box className={Style.widthLimit}>

      {children}
      <Outlet />

    </Box>
  </Box>
;
