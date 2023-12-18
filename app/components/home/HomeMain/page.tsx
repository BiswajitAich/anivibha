import { NextPage } from 'next'
import Link from 'next/link'

const HomeMain: NextPage = () => {
    return (
        <>
            <Link href='components/home/Anime' >
                <div>HomeMain</div>
            </Link>
        </>
    )
}

export default HomeMain