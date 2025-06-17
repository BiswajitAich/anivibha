"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import LoadingComponent from "../../LoadingComponent/page";
import style from "../../../css/recentEpisodes.module.css"
import { fetchDataAction } from "./fetchDataAction";
import Client from "./Client";
import { RecentAnime } from "@/app/utils/parsers/parse";

const Display = ({ initialData }: { initialData: any }) => {
    const [show, setShow] = useState<string>("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [response, setResponse] = useState<{
        currentPage: number,
        hasNextPage: number,
        results: RecentAnime[]
    }>(initialData);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (!isInitialized) {
            const storedShow = sessionStorage.getItem("show");
            if (!storedShow) {
                sessionStorage.setItem("show", "Dub");
                setShow("Dub");
            } else {
                setShow(storedShow);
                if (storedShow !== "Dub") {
                    handleShow(storedShow);
                }
            }
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const handleShow = (data: string) => {
        sessionStorage.setItem("show", data);
        setShow(data);

        let type: number;
        if (data === "Sub") {
            type = 1;
        } else if (data === "Dub") {
            type = 2;
        } else {
            type = 3;
        }

        startTransition(async () => {
            const newData = await fetchDataAction(1, type);
            if (newData) {
                setResponse(newData);
            }
        });
    }

    if (!isInitialized) {
        return <LoadingComponent />;
    }

    return (
        <div className={style.recentEpisodesContainer}>
            <h2>Recent Episodes</h2>
            <span className={style.line} />
            <div className={style.typeBtns}>
                <button
                    className={`${style.btn} ${show === "Sub" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("Sub")}
                    disabled={isPending}
                >
                    Sub
                </button>
                <button
                    className={`${style.btn} ${show === "Dub" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("Dub")}
                    disabled={isPending}
                >
                    Dub
                </button>
                <button
                    className={`${style.btn} ${show === "All" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("All")}
                    disabled={isPending}
                >
                    All
                </button>
            </div>

            <Suspense fallback={<LoadingComponent />}>
                {isPending ? (
                    <LoadingComponent />
                ) : (
                    <>
                        {show === "All" && <Client data={response} />}
                        {show === "Dub" && <Client data={response} sel={"dub"} />}
                        {show === "Sub" && <Client data={response} sel={"sub"} />}
                    </>
                )}
            </Suspense>
        </div>
    );
}

export default Display;