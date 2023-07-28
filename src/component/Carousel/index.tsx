import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
// import { autoPlay } from 'react-swipeable-views-utils';
import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
// import { ENDPOINT } from '~/Utils/fetchCommon';
import ModuloNoNegative from '~/Utils/ModuloNoNegative';
import { DisplayableMedia } from '~/Utils/Types';
import Style from './index.scss';
// import OnErrorReloadVideo from './OnErrorReloadVideo';
// import OnErrorReloadImage from './OnErrorReloadImage';

// const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
// const AutoPlaySwipeableViews = SwipeableViews;


export const RenderDisplay = ({src, type}: DisplayableMedia) => {
    if(type == 'video') {
        return <video className={Style.fullContained} onClick={evt => evt.stopPropagation()}>
            <source src={src} />
        </video>;
    }
    return <img src={src} className={Style.fullContained} onClick={evt => evt.stopPropagation()} />;
}

export type StepperProps = {
    maxSteps: number,
    activeStep: number,
    setActiveStep: (callback :((prevActiveStep: number) => number)) => void,
    // isAutoPlaying: boolean,
    // setIsAutoPlaying: ((value: boolean) => void ) & ((callback: (oldValue: boolean) => boolean) => void),
    displays: Displayable[],
};

export interface DotStepperProps extends StepperProps {
    noStepperSetter?: boolean,
}

export const DotStepper = ({maxSteps, activeStep, setActiveStep, displays, noStepperSetter=false}: DotStepperProps) => <MobileStepper
    steps={maxSteps}
    position="static"
    activeStep={activeStep}
    nextButton={
        noStepperSetter
            ? undefined
            : <Button
                size="small"
                onClick={() => setActiveStep((prevActiveStep) => ModuloNoNegative(prevActiveStep + 1, displays.length))}
            // disabled={activeStep === maxSteps - 1}
            >
                <KeyboardArrowRight />
            </Button>
    }
    backButton={
        noStepperSetter
            ? undefined
            : <Button size="small" onClick={() => setActiveStep((prevActiveStep) => ModuloNoNegative(prevActiveStep - 1, displays.length))}
                // disabled={activeStep === 0}
            >
                <KeyboardArrowLeft />
            </Button>
    }
/>

export interface Displayable extends DisplayableMedia {
    key: string | number,
    label?: string,
}

export type Props = {
    withLabel?: boolean,
    noStepperSetter?: boolean,
    // autoHeight?: boolean,
    // defaultAutoPlay?: boolean,
    index?: number,
    // isAutoPlay?: boolean,
    displays: Displayable[],
    stepper: (props: StepperProps) => JSX.Element,
};

export default ({withLabel=false,
    // children,
    index=0,
    // noStepperSetter=false,
    displays, stepper: Stepper}: Props) => {
    // export default ({withLabel=false, noStepperSetter=false, displays}: Params) => {
    const [activeStep, setActiveStep] = useState<number>(index);
    // console.log(`isAutoPlay=${isAutoPlay}`);

    // useEffect(() => {
    //     if(displays.length - 1 < activeStep) {
    //         setActiveStep(0);
    //     }
    // }, [displays]);

    const maxSteps = displays.length;

    // const [minHeight, setMinHeight] = useState<number>(0);
    // const displayKeys = useMemo(() => {
    //     return new Set<string | number>(displays.map(({key}) => key));
    // }, [displays]);
    // useEffect(() => {
    //     setMinHeight(0);
    // }, [displayKeys]);

    // const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(defaultAutoPlay);
    // const [mouseHover, setMouseHover] = useState<boolean>(false);

    // const handleStepChange = (step: number) => {
    //     setActiveStep(step);
    // };

    // const displayerRef = useRef<HTMLDivElement>(null);

    // if(displays.length - 1 < activeStep) {
    //     return <></>;
    // }

    // console.log(`activeStep=${activeStep}`);

    return <>
        {/* <Box
            sx={{ width: '100%', height: '100%' }}
            onMouseEnter={() => setMouseHover(true)}
            onMouseLeave={() => setMouseHover(false)}
        >

        </Box> */}

        <SwipeableViews
            // autoPlay
            animateHeight={false}
            // onTransitionEnd={() => {
            //     const curHeight = displayerRef.current?.clientHeight || 0;
            //     // console.log(minHeight, curHeight);
            //     if(curHeight > minHeight) {
            //         // console.log(`set min height  to ${curHeight}`)
            //         setMinHeight(curHeight);
            //     }
            // }}
            axis='x'
            index={activeStep}
            onChangeIndex={setActiveStep}
            enableMouseEvents
            className={Style.swipeView}
            containerStyle={{
                height: '100%',
                width: '100%',
            }}
            slideStyle={{
                height: '100%',
                width: '100%',
                overflow: 'hidden',
            }}
        >
            {/* {displays.map((displayFile, index) => <div key={displayFile.key}>
                {Math.abs(activeStep - index) <= 2
                    // ? <div ref={displayerRef}
                    //     style={autoHeight? undefined: {minHeight: minHeight}}
                    // ><RenderDisplay {...displayFile}/></div>
                    ? <RenderDisplay {...displayFile}/>
                    : null}
            </div>)} */}
            {displays.map((displayFile) => <RenderDisplay key={displayFile.key} {...displayFile}/>)}
        </SwipeableViews>

        {withLabel && <Paper
            square
            elevation={0}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 50,
                pl: 2,
                bgcolor: 'background.default',
            }}
        >
            <Typography variant="body1" component="div">{displays[activeStep]?.label || ''}</Typography>
        </Paper>}

        <Stepper
            // children={children}
            maxSteps={maxSteps}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            displays={displays}
            // isAutoPlaying={isAutoPlaying && !mouseHover}
            // setIsAutoPlaying={setIsAutoPlaying}
        />
    </>;
}


// export default (params: Props) => {
//     if(params.displays.length === 0) {
//         return <>{params.children}</>;
//     }

//     return <Carusel {...params} />;
// }
