import React from 'react';
import {
    Link,
} from 'react-router-dom';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/system/Box';
import Alert from '@mui/material/Alert';

export default function () {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Paper sx={{ margin: '10px' }}>
                <Alert
                    severity="error"
                    action={(
                        <Link to="/" style={{ textDecoration: 'inherit', color: 'inherit' }}>
                            <Button color="inherit" size="small">
                返回
                            </Button>
                        </Link>
                    )}
                >
          页面不存在
                </Alert>
            </Paper>
        </Box>
    );
}
