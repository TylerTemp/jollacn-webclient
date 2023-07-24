import Pagination from '@mui/material/Pagination';

export interface PaingParams {
    total: number,
    offset: number,
    limit: number,
    onOffsetChange: (offset: number) => void,
    onLimitChange?: (limit: number) => void,
    lessThan2Page?: JSX.Element,
}

export default({
    total,
    offset,
    limit,
    onOffsetChange,
    lessThan2Page=<></>
}: PaingParams) => {

    const totalPage = Math.ceil(total / limit);

    if(lessThan2Page && totalPage <= 2) {
        return lessThan2Page;
    }

    const currentPage = Math.ceil(offset / limit) + 1;

    return <Pagination
        count={totalPage}
        defaultPage={currentPage}
        page={currentPage}
        siblingCount={3}
        sx={{display: 'inline-block'}}
        onChange={(_: React.ChangeEvent<unknown>, value: number) => {
            onOffsetChange((value-1) * limit);
        }}
    />;
}
