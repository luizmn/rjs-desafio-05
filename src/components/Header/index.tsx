import Head from "next/head";
import Image from "next/image";

import styles from "./header.module.scss";

export default function Header(post) {
  return (
    <>
      <Head>
      {!post && (
          <title>spacetraveling</title>
        )}
      {post && (
          <title>{post?.title} | spacetraveling</title>
      )}
      </Head>
      <header className={styles.logo}>
        <Image src="/logo.svg" alt="logo" width={238} height={25} />
      </header>
    </>
  )
}
