"use client";

import { Suspense, useEffect, useState, useTransition } from "react";
import LoadingComponent from "../../LoadingComponent/page";
import style from "../../../css/recentEpisodes.module.css"
import { fetchDataAction } from "./fetchDataAction";
import Client from "./Client";
import { AnimePoster } from "@/app/utils/parsers/parse2";
import Link from "next/link";

const Display = ({ initialData }: { initialData: AnimePoster[] }) => {
    const [show, setShow] = useState<string>("");
    const [isInitialized, setIsInitialized] = useState(false);
    const [response, setResponse] = useState<AnimePoster[]>(initialData);
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
            type = 0;
        }

        startTransition(async () => {
            const newData = await fetchDataAction(type, "recently_updated");
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
            <h2 className={style.head}>Recent Episodes<Link href={`/view?sort=recently_updated&language=${show === "Sub" ? 1 : (show === "Dub" ? 2 : 0)}`} className={style.viewMoreBtn}>&#9654;</Link></h2>
            <span className={style.line} />
            <div className={style.typeBtns}>
                <button
                    className={`${style.btn} ${show === "All" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("All")}
                    disabled={isPending || show === "All" ? true : false}
                >
                    All
                </button>
                <button
                    className={`${style.btn} ${show === "Sub" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("Sub")}
                    disabled={isPending || show === "Sub" ? true : false}
                >
                    Sub
                </button>
                <button
                    className={`${style.btn} ${show === "Dub" ? style.activeBtn : ""} `}
                    onClick={() => handleShow("Dub")}
                    disabled={isPending || show === "Dub" ? true : false}
                >
                    Dub
                </button>
            </div>

            <Suspense fallback={<LoadingComponent />}>
                {isPending ? (
                    <LoadingComponent />
                ) : (
                    <>
                        {show === "All" && <Client data={response} sel={undefined} />}
                        {show === "Dub" && <Client data={response} sel={"dub"} />}
                        {show === "Sub" && <Client data={response} sel={"sub"} />}
                    </>
                )}
            </Suspense>
        </div>
    );
}

export default Display;