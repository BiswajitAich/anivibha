import { NextPage } from 'next'
import Link from 'next/link'
import style from '@/app/home/styles/home.module.css'

const HomeMain: NextPage = () => {
    return (
        <div className={style.home}>
            <div className={style.homeDiv}>
                <p className={style.text}>watch unlimited anime here for free</p>
                <div />
                <Link href='/home' >
                    <p>Enter</p>
                </Link>
            </div>
        </div>
    )
}

export default HomeMain