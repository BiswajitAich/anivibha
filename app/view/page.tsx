import Header from "../(components)/home/(Anime)/Header";
import { validPageCategory, validLanguageCategory, validSortCategory } from "../api/types/pageCategory";
import { AnimePoster } from "../utils/parsers/parse2";
import { fetchPageDataAction } from "./fetchPageDataAction";
import PageComponent from "./PageComponent";
import styles from '@/app/view/styles/View.module.css';
interface PageProps {
    searchParams: Promise<{
        category?: string;
        sort?: string;
        language?: number;
        page?: string;
    }>;
}
const page = async ({ searchParams }: PageProps) => {
    const params = await searchParams;

    // validate parameters
    const category = params.category;
    const sort = params.sort;
    const language = params.language ? params.language : 0;
    const pageNum = params.page ? params.page : "1";

    let data: AnimePoster[] = [];
    let path: string | undefined = undefined;
    try {
        if (category && (validPageCategory as string[]).includes(category)) {
            data = await fetchPageDataAction(pageNum, category);
            path = `?category=${category}`;
        }
        else if (
            (language && (validLanguageCategory as number[]).includes(language)) ||
            (sort && (validSortCategory as string[]).includes(sort))
        ) {
            data = await fetchPageDataAction(pageNum, undefined, language, sort);
            if (language) {
                path = `?sort=${sort}&language=${language}`;
            }
            else if (sort) {
                path = `?sort=${sort}`;
            }
        }
        if (data.length === 0) {
            return <div><h1>No data found</h1></div>
        }

    } catch (error) {
        return <p className={styles.message}>No data found</p>
    }
    return (
        <div className={styles.viewpage}>
            <Header />
            <PageComponent data={data} path={path} page={pageNum} language={language}/>
        </div>
    );
}

export default page;