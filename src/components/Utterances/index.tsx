import React, { useEffect } from "react";
import styles from "./comments.module.scss";

const COMMENTS_ID = "comments-container";

const Comments = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://utteranc.es/client.js";
    script.setAttribute("repo", "luizmn/rjs-desafio-05");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-dark");
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    const comments = document.getElementById(COMMENTS_ID);
    if (comments) comments.appendChild(script);

    // This function will get called when the component unmounts
    // To make sure we don't end up with multiple instances of the comments component
    return () => {
      const comments = document.getElementById(COMMENTS_ID);
      if (comments) comments.innerHTML = "";
    };
  }, []);

  return (
    <div className={styles.comments}>
      <h2>Coment&aacute;rios</h2>
      <div id={COMMENTS_ID} className={styles.utterances} />
    </div>
  );
};

export default Comments;