import { NextPage } from 'next'
import style from '../../css/loadingComponent.module.css'

const LoadingComponent: NextPage = () => {
    const loadingText = "Loading";
    return (
        <div className={style.loadingContainer}>
            <div className={style.loadingBody}>
                <div className={style.loadingText}>
                    {loadingText.split('').map((char, index) => (
                        <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
                            {char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default LoadingComponent;