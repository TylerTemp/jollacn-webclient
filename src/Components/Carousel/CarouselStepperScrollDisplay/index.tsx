import { type StepperProps } from "~/Components/Carousel";
import Button from "@mui/material/Button";
import { ENDPOINT } from "~/Utils/fetchCommon";
// import { type GenFile } from "~/Utils/Types";
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Style from "./index.scss";
import ModuloNoNegative from "~/Utils/ModuloNoNegative";
import { useEffect, useRef, useState } from "react";
import Slider from "@mui/material/Slider";
// import useTheme from "@mui/material/styles/useTheme";

export const RenderDisplay = ({src}: {src: string}) => {
    return <img src={src} style={{width: 'auto', height: '100%'}} />;
}

interface Params extends Pick<StepperProps, "setActiveStep" | "displays" | "activeStep"> {
    height: number,
    noPager?: boolean,
    disabled?: boolean,
}

export default ({height, noPager=false, disabled=false, activeStep, setActiveStep, displays}: Params) => {

    const scrollDiv = useRef<HTMLDivElement>(null);
    const [hasSlider, setHasSlider] = useState<boolean>(true);
    // const theme = useTheme();

    if(displays.length <= 1) {
        return <></>;
    }

    const handleNext = () => {
        setActiveStep((prevActiveStep) => ModuloNoNegative(prevActiveStep + 1, displays.length));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => ModuloNoNegative(prevActiveStep - 1, displays.length));
    };

    useEffect(() => {
        const scrollCurrent = scrollDiv.current;
        if(!scrollCurrent) {
            return;
        }
        const displayTarget = scrollCurrent.querySelector(`:nth-child(${activeStep + 1})`) as HTMLDivElement;
        const containerWidth = scrollCurrent.clientWidth;
        const scrollOffset = displayTarget?.offsetLeft || 0;
        scrollCurrent.scrollTo({
            left: scrollOffset - containerWidth / 2,
            behavior: 'smooth',
        })

    }, [activeStep]);

    useEffect(() => {
        const scrollCurrent = scrollDiv.current;
        if(scrollCurrent) {
            const containerWidth = scrollCurrent.clientWidth;
            const scrollableWidth = scrollCurrent.scrollWidth;
            // console.log(containerWidth, scrollableWidth);
            const needSlider = scrollableWidth > containerWidth;
            if(needSlider !== hasSlider) {
                setHasSlider(needSlider);
            }
        }
    }, [scrollDiv.current, activeStep]);

    const hasPagger = !noPager && !disabled;

    return <div className={Style.container}>
        {hasPagger && <Button size="small" onClick={handleBack} className={Style.stepButton}>
            <KeyboardArrowLeft />
        </Button>}
        <div className={Style.middle}>
            <div ref={scrollDiv} className={Style.stepItems}>
                {displays.map((display, index) => <Button
                    key={display.key}
                    component={disabled? "div": "button"}
                    sx={{height, padding: `${activeStep === index? '2px 1px': '0'}`}}
                    classes={{root: Style.stepItemButtonOverride}}
                    variant={activeStep === index? "contained": undefined}
                    color="secondary"
                    onClick={() => setActiveStep(() => index)}
                >
                    <RenderDisplay {...display} />
                </Button>)}
            </div>
            {hasSlider && displays.length > 2 && <div className={Style.sliderWrapper}>
                <Slider
                    color="secondary"
                    step={1}
                    max={displays.length-1}
                    value={activeStep}
                    classes={{
                        root: Style.noPadding,
                        thumb: Style.displayNone,
                        // rail: Style.rail,
                        // track: Style.track,
                    }}
                    onChange={(_, newValue) => {
                        if (typeof newValue === 'number') {
                            setActiveStep(() => newValue);
                        }
                    }}
                />
            </div>}
        </div>
        {hasPagger && <Button
            className={Style.stepButton}
            size="small"
            onClick={handleNext}
        >
            <KeyboardArrowRight />
        </Button>}
    </div>;
}
