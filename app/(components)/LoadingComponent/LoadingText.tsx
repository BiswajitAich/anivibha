import { NextPage } from 'next'
import style from '../../css/loadingComponent.module.css'

const LoadingText: NextPage = () => {
    const loadingText = "Loading";
    return (
        <div >
            {loadingText.split('').map((char, index) => (
                <span key={index}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    className={style.text}>
                    {char}
                </span>
            ))}
        </div>
    )
}
export default LoadingText