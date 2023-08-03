import { useContext } from 'react';
import Style from './MountPoint.css';
import { MainBottomContext } from './MainBottomProvider';

export default () => {
    const mainButtomRef = useContext(MainBottomContext);

    // console.log(`set mainButtomRef`, mainButtomRef);

    // setTimeout(() => {
    //     console.log(`timeout ref=${mainButtomRef}`);
    // }, 500);

    // useEffect(() => {
    //     console.log(`ref changed`, mainButtomRef);
    // }, [mainButtomRef.current]);

    return <div className={Style.mainBottom} ref={mainButtomRef} />;
}
