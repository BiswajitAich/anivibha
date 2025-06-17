import { NextPage } from "next"; 
import Display from "./Display";
import { fetchDataAction } from "./fetchDataAction";

const RecentEpisodes: NextPage = async () => {
  // Fetch initial data on the server
  const initialData = await fetchDataAction(1, 2); // Default to Dub (type 2)
  
  return (
    <Display
      initialData={initialData}
    />
  )
}

export default RecentEpisodes;