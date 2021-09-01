/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Image from "next/image";
import Link from "next/link";

import styles from "./header.module.scss";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function Header() {
  return (
    <>
      <header className={styles.logo}>
        <Link href="/">
          <a>
            <Image src="/logo.svg" alt="logo" width={238} height={25} />
          </a>
        </Link>
      </header>
    </>
  );
}
