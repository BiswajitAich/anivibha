"use client"
import { NextPage } from "next";
import { Suspense, useEffect, useState } from "react";
import style from "../../../css/recentEpisodes.module.css"
import Chinese from "./Chinese/page";
import Dub from "./Dub/page";
import Sub from "./Sub/page";


const Episodes: NextPage = () => {
  const [show, setShow] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("show")) {
      sessionStorage.setItem("show", "dub")
      setShow("dub");
    }
    const storedShow = sessionStorage.getItem("show")
    setShow(storedShow || "dub");

  }, [])

  const handleShow = (data: string) => {
    sessionStorage.setItem("show", data);
    setShow(data);
  }
  return (
    <div className={style.recentEpisodesContainer}>
      <h2> Resent Episodes</h2>
      <div className={style.typeBtns}>

        <button
          style={{
            background: show === "sub" ? "cyan" : "transparent",
            color: show === "sub" ? "black" : "inherit",
          }}
          onClick={() => handleShow("sub")}
        >
          Sub
        </button>
        <button style={{
          background: show === "dub" ? "cyan" : "transparent",
          color: show === "dub" ? "black" : "inherit",
        }}
          onClick={() => handleShow("dub")}>
          Dub
        </button>
        <button style={{
          background: show === "chinese" ? "cyan" : "transparent",
          color: show === "chinese" ? "black" : "inherit"
        }}
          onClick={() => handleShow("chinese")}>
          Chinese
        </button>

      </div>
      <Suspense fallback={<div style={{ color: "white" }}>loadings...</div>}>
        {show === "dub" ?
          <Dub /> : null}
        {show === "sub" ?
          <Sub /> : null}
        {show === "chinese" ?
          <Chinese /> : null}
      </Suspense>
    </div >
  )
}
export default Episodes;