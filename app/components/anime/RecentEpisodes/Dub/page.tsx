import { NextPage } from "next";
import DubClient from "./DubClient";

let data: any | null = null;
let isFetchDataCalled = false;
let controller: AbortController | null = null;

const fetchData = async () => {
    try {
        controller = new AbortController();
        const signal = controller.signal;
        const response = await fetch(`${window.location.origin}/api/anime/FetchRecentEpisodes`, {
            method: "POST",
            body: JSON.stringify({
                page: "1",
                type: "2"
            }),
            next: {
                revalidate: 10000,
            },
            signal
        });
        console.log("Page revalidated:", new Date().toLocaleTimeString());
        data = await response.json();
    } catch (error) {
        console.error(error);
    }
    isFetchDataCalled = true;
};

const Dub: NextPage = async () => {

    if (!isFetchDataCalled) {
        await fetchData();
        isFetchDataCalled = true;
    }

    if (controller) {
        controller.abort();
        controller = null;
    }

    return (
        <div>
            <DubClient data={data} />
        </div>
    );
};

export default Dub;


// import type { NextPage } from "next";
// import DubClient from "./DubClient";



// const Dub: NextPage = async () => {

//     let data: any | null = null;
//     try {
//         const response = await fetch(`${window.location.origin}/api/anime/FetchRecentEpisodes`, {
//             method: "POST",
//             body: JSON.stringify({
//                 page: "1",
//                 type: "2"
//             }),
//             next: {
//                 revalidate: 3000,
//             }
//         });
//         data = await response.json()

//     } catch (error) {
//         console.error(error);
//     }




//     return (
//         <div >
//             <DubClient data={data} />
//         </div>
//     );
// };

// export default Dub;