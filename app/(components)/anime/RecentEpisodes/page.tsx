import { NextPage } from "next"; 
import Display from "./Display";
import { fetchDataAction } from "./fetchDataAction";

const RecentEpisodes: NextPage = async () => {
    let initialData = null;
    
    try {
      initialData = await fetchDataAction(1, 2); // Default to Dub (type 2)
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      initialData = { info: [] };
    }
  
  return (
    <Display
      initialData={initialData || []}
    />
  )
}

export default RecentEpisodes;