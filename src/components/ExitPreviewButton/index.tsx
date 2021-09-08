/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from "react";
import { useRouter } from "next/router";
import styles from "./exitbutton.module.scss";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function ExitPreviewButton({ children }) {
  const { isPreview } = useRouter()
  return (
    <div className={styles.exitButton}>
      {children}
      {isPreview ? <a href="/api/exit-preview">Exit Preview</a> : null}
    </div>
  )
}