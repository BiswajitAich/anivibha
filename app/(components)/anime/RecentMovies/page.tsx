import { NextPage } from 'next'
import RecentMoviesClient from './RecentMoviesClient'

const RecentMovies: NextPage = async () => {
    let data: any | null = null

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/anime/FetchRecentMovies`,{
            method: 'POST',
            body: JSON.stringify({page: '2'}),
            next:{
                revalidate: 30000,
            }
        });
        data = await res.json();
        // console.log(data);
    } catch (error) {
        console.log(error)
    }

    
    return (
        <>
            <RecentMoviesClient data={data}/>
        </>
    )
}

export default RecentMovies