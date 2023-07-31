import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import red from "@mui/material/colors/red";
import Grid from "@mui/system/Unstable_Grid";
import { useRef, useState } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import { type Comment } from "~/Utils/Types";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import AlertSimple from "~/Components/AlertSimple";
import Box from "@mui/system/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import Typography from "@mui/material/Typography";

interface Props {
    uri: string,
    onAdd: (comment: Comment) => void,
}

interface ApiState {
    loading: boolean,
    error: Error | null,
    comment: Comment | null,
}


export default ({ uri, onAdd }: Props) => {
    const [apiState, setApiState] = useState<ApiState>({ loading: false, error: null, comment: null });

    const nicknameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const postComment = () => {
        setApiState({
            loading: true,
            error: null,
            comment: null,
        });
        ReqJsonToType<Comment>(uri, {
            method: 'POST',
            body: JSON.stringify({
                nickname: nicknameRef.current?.value,
                email: emailRef.current?.value,
                content: contentRef.current?.value,
            }),
        })
            .then((comment) => {
                setApiState({
                    loading: false,
                    error: null,
                    comment,
                });
                onAdd(comment);
                return;
            })
            .catch((error) => setApiState({
                loading: false,
                error,
                comment: null,
            }));
    };

    return <form
        method="POST"
        action={uri}
        onSubmit={(evt) => {
            evt.preventDefault();
            postComment();
            return false;
        }}
    >

        <Typography variant="h6">评论</Typography>
        <Grid container spacing={1}>
            <Grid
                sm={12}
                md={6}
            >
                <FormControl fullWidth disabled={apiState.loading}>
                    <InputLabel htmlFor="comment-name">
                        <span style={{ color: red[500] }}>*</span>
                        {' '}
              昵称
                    </InputLabel>
                    <Input
                        id="comment-name"
                        startAdornment={<InputAdornment position="start">
                            <AccountCircleOutlinedIcon />
                        </InputAdornment>}
                        type="text"
                        name="nickname"
                        inputRef={nicknameRef}
                        placeholder="* 怎么称呼您呐_(:з」∠)_"
                        required
                    />
                </FormControl>
            </Grid>
            <Grid
                sm={12}
                md={6}
            >
                <FormControl fullWidth disabled={apiState.loading}>
                    <InputLabel htmlFor="comment-email">邮箱(可选)</InputLabel>
                    <Input
                        id="comment-email"
                        startAdornment={                  <InputAdornment position="start">
                            <EmailOutlinedIcon />
                        </InputAdornment>}
                        type="email"
                        name="email"
                        inputRef={emailRef}
                        placeholder="不会被显示和公布"
                    />
                </FormControl>
            </Grid>

            <Grid
                sm={12}
            >
                <FormControl fullWidth disabled={apiState.loading}>
                    <Input
                        id="comment-content"
                        multiline
                        minRows={3}
                        startAdornment={<InputAdornment position="start">
                            <TextsmsOutlinedIcon />
                        </InputAdornment>}
                        type="text"
                        name="content"
                        ref={contentRef}
                        placeholder="*来都来了不说说都不好意思直接走..."
                        required
                    />
                </FormControl>
            </Grid>

            <Grid sm={9}>
                { apiState.error && <AlertSimple
                    severity="error"
                    onClose={() => setApiState(old => ({...old, error: null}))}
                >
                    {apiState.error.message}
                </AlertSimple>}
                { apiState.comment && <AlertSimple
                    onClose={() => setApiState(old => ({...old, comment: null}))}
                >
            发布成功
                </AlertSimple>}
            </Grid>
            <Grid sm={3}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <LoadingButton
                        type="submit"
                        endIcon={<SendIcon />}
                        loading={apiState.loading}
                        loadingPosition="end"
                        variant="contained"
                    >
              提交
                    </LoadingButton>
                </Box>
            </Grid>
        </Grid>
    </form>;
}
