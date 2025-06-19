import { NextPage } from "next";
import Display from "./Display";
import { fetchDataAction } from "./fetchDataAction";
import { AnimePoster } from "@/app/utils/parsers/parse2";

const RecentEpisodes: NextPage = async () => {
  let initialData = [] as AnimePoster[];

  try {
    initialData = await fetchDataAction(2, "recently_updated"); // Default to Dub (type 2)
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    initialData = [];
  }

  return (
    <Display
      initialData={initialData || []}
    />
  )
}

export default RecentEpisodes;