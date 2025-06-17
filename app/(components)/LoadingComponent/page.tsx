import { NextPage } from 'next'
import style from '../../css/loadingComponent.module.css'
import LoadingText from './LoadingText';

const LoadingComponent: NextPage = () => {

    return (
        <div className={style.loadingContainer}>
            <div className={style.loadingBody}>
                <div className={style.loadingText}>
                    <LoadingText />
                </div>
            </div>
        </div>
    )
}
export default LoadingComponent;

