import { GetStaticProps } from "next";
import Header from "../components/Header";

import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

import Image from "next/image";

// interface Post {
//   uid?: string;
//   first_publication_date: string | null;
//   data: {
//     title: string;
//     subtitle: string;
//     author: string;
//   };
// }

// interface PostPagination {
//   next_page: string;
//   results: Post[];
// }

// interface HomeProps {
//   postsPagination: PostPagination;
// }

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.post}>
          <h1 className={styles.title}>Como utilizar Hooks </h1>
          <p className={styles.subtitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </p>
          <div className={styles.info}>
            <span className={styles.createdAt}>25 Ago 2021</span>
            <span className={styles.author}>Joseph Climber</span>
          </div>
        </div>
        <div className={styles.post}>
          <h1 className={styles.title}>Criando um app CRA do zero </h1>
          <p className={styles.subtitle}>
            Tudo sobre como criar a sua própria aplicação com o React
          </p>
          <div className={styles.info}>
            <span className={styles.createdAt}>25 Ago 2021</span>
            <span className={styles.author}>Joseph Climber</span>
          </div>
        </div>
        <button className={styles.loadButton}>Carregar mais posts</button>
      </div>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
