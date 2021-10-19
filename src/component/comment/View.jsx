import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/system/Box';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import CommentAdd from '~/component/comment_add';
import CommentList from '~/component/comment_list';


const CardLayout = ({children}) => <Card sx={{margin: '0px 5px'}}>{children}</Card>;


export default ({uri, preList, addPreList}) => <CardLayout>
  <CardContent>
    <CommentAdd uri={uri} onSucceed={addPreList} />
    <Divider />
    <CommentList uri={uri} preList={preList}/>
  </CardContent>
</CardLayout>;
