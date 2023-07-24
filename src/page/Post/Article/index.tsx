import { Suspense, useMemo } from "react";
import ReqJsonToType from "~/Utils/ReqJsonToType";
import Suspendable from "~/Utils/Suspendable";
import useRetryWithAbortController from "~/Utils/useRetryWithAbortController";
import RetryErrorBoundary from "~/component/RetryErrorBoundary";

interface

const Renderer = ()

interface Props {
    slug: string,
    backUrl: string
}

export default ({slug, backUrl}: Props) => {
    const {retryKey, doRetry, doAbort} = useRetryWithAbortController();

    const getPost = useMemo(
        () => Suspendable(
            ReqJsonToType(`/post/${slug}`, {signal: doAbort()})
        ),
        [retryKey]);


    return <RetryErrorBoundary onRetry={doRetry}>
    <Suspense fallback={<p>Loading</p>}>
        <Renderer
            key={retryKey}
            getPost={getPost} />
    </Suspense>
</RetryErrorBoundary>;
}