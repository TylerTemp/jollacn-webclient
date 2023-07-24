import { Fragment, useContext, MutableRefObject, PropsWithChildren, createContext, useEffect, useRef, useState } from 'react';
// import Context from './MainBottomContext';

// type Params = {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     [key: string | number | symbol]: any
// }

export const MainBottomContext = createContext<MutableRefObject<HTMLDivElement>>(null);

interface useMoutnRefProps {
    refValue: MutableRefObject<HTMLDivElement>,
    key: number,
}

export const useMountRef = () => {

    const refValue = useContext(MainBottomContext);

    const [refState, setRefState] = useState<useMoutnRefProps>({refValue, key: 1});
    useEffect(() => {
        // console.log(`ref changed upper`, refValue);
        if(refValue.current) {
            // console.log(`change state upper`);
            setRefState(({key: oldKey}) => ({refValue, key: -oldKey}));
        }
    }, [refValue.current]);
    return refState;
}

export default ({children}: PropsWithChildren) => <MainBottomContext.Provider value={useRef<HTMLDivElement>(null)}>
    {children}
</MainBottomContext.Provider>;