import Head from "next/head";
import Image from "next/image";

import styles from "./header.module.scss";

export default function Header() {
  return (
    <>
      <Head>
        <title>spacetraveling</title>
      </Head>
      <header className={styles.logo}>
        <Image src="/logo.svg" alt="logo" width={238} height={25} />
      </header>
    </>
  )
}
