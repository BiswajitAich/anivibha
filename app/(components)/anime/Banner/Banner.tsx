import BannerContainer from "./BannerContainer";
import { fetchBannerDataAction } from "./fetchBannerDataAction";

const Banner = async () => {
    const data = await fetchBannerDataAction();
    return (
        <BannerContainer props={data}/>
    );
}

export default Banner;

