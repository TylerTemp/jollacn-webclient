import Pagination from '@mui/material/Pagination';
import ShuffleOnTwoToneIcon from '@mui/icons-material/ShuffleOnTwoTone';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Style from "./index.css";
import InputAdornment from '@mui/material/InputAdornment';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import useDebounce from '~/Utils/useDebounce';

type RenderLimitChangeProp = {
    limit: number,
    onLimitChange: (limit: number) => void,
}

const RenderLimitChange = ({limit, onLimitChange}: RenderLimitChangeProp) => {

    const [displayLimit, setDisplayLimit] = useState<number | ''>(limit);
    useEffect(() => {
        setDisplayLimit(limit);
    }, [limit]);

    const doLimitChange = (newValue: number) => {
        if(newValue === limit) {
            setDisplayLimit(limit);
        }
        else {
            onLimitChange(newValue);
        }
    }

    const {startDebounce, cancelDebounce} = useDebounce(500);
    const startLimitChangeDebounce = ():void => startDebounce(() => doLimitChange(displayLimit as number));

    const [optionOpen, setOptionOpen] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const width = 120;

    return <ClickAwayListener onClickAway={() => {
        cancelDebounce();
        setOptionOpen(false);
        if(displayLimit !== limit) {
            console.log(`reset display`);
            setDisplayLimit(limit);
        }
    }}>
        <div>
            <TextField
                type="number"
                variant="standard"
                size="small"
                sx={{width}}
                inputRef={inputRef}
                InputProps={{
                    classes:{input: Style.inputNoArrow},
                    endAdornment: <InputAdornment position="end">
                        /Page
                        {displayLimit !== '' && <IconButton onClick={evt => {
                            console.log(`on clear`);
                            evt.stopPropagation();
                            setDisplayLimit('');
                            inputRef.current?.focus();
                            setOptionOpen(true);
                        }}>
                            <HighlightOffTwoToneIcon />
                        </IconButton>}
                    </InputAdornment>
                }}

                value={displayLimit}
                onFocus={() => setOptionOpen(true)}
                onClick={() => setOptionOpen(true)}
                // onBlur={() => {
                //     cancelDebounce();
                //     // if(displayLimit !== limit) {
                //     //     console.log(`reset display`);
                //     //     setDisplayLimit(limit);
                //     // }
                // }}
                onChange={({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {
                    cancelDebounce();

                    console.log('enter limit', value);
                    if(value === '') {
                        setDisplayLimit('');
                        return;
                    }

                    const result = parseInt(value);
                    if(!Number.isNaN(result) && result > 0) {
                        setDisplayLimit(result);
                        startLimitChangeDebounce();
                    }
                }}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                    if(event.key === 'Enter' || event.key === 'NumpadEnter') {
                        cancelDebounce();

                        event.preventDefault();
                        const value = (event.target as HTMLInputElement).value;
                        console.log('enter limit', value);
                        const result = parseInt(value);
                        if(!Number.isNaN(result) && result > 0) {
                            setDisplayLimit(result);
                            doLimitChange(result);
                        }
                    }
                }}
            />
            <Popper open={optionOpen} anchorEl={inputRef.current} placement="bottom-start">
                <Paper sx={{width}}>
                    <List>
                        {[20, 30, 50].map(numOption => <ListItem
                            key={numOption}
                            disablePadding
                            disableGutters
                        >
                            <ListItemButton autoFocus={numOption === limit} onClick={() => {
                                console.log(`change limit ${numOption}`);
                                cancelDebounce();

                                setOptionOpen(false);
                                setDisplayLimit(numOption);
                                doLimitChange(numOption);
                            }}>
                                <ListItemText primary={numOption} />
                            </ListItemButton>
                        </ListItem>)}
                    </List>
                </Paper>
            </Popper>
        </div>
    </ClickAwayListener>;
}


export interface PaingParams {
    total: number,
    offset: number,
    limit: number,
    onOffsetChange: (offset: number) => void,
    onLimitChange?: (limit: number) => void,
    lessThan2Page?: JSX.Element | null,
}

export default({
    total,
    offset,
    limit,
    onOffsetChange,
    onLimitChange,
    lessThan2Page=<></>
}: PaingParams) => {

    const totalPage = Math.ceil(total / limit);

    if(lessThan2Page && totalPage <= 2) {
        return lessThan2Page;
    }

    const currentPage = Math.ceil(offset / limit) + 1;

    return <>
        <Pagination
            count={totalPage}
            defaultPage={currentPage}
            page={currentPage}
            siblingCount={3}
            sx={{display: 'inline-block'}}
            onChange={(_: React.ChangeEvent<unknown>, value: number) => {
                onOffsetChange((value-1) * limit);
            }}
        />
        {onLimitChange && <RenderLimitChange
            limit={limit}
            onLimitChange={onLimitChange}
        />}
    </>;
}
