import { GetStaticProps } from "next";
import Image from "next/image";

import { FiCalendar, FiUser } from "react-icons/fi";

import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

import Header from "../components/Header";

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
      <div className={styles.container}>
        <Header />
        <div className={styles.post}>
          <h1 className={styles.title}>Como utilizar Hooks </h1>
          <p className={styles.subtitle}>
            Pensando em sincronização em vez de ciclos de vida.
          </p>
          <div className={styles.info}>
            <span>
              <FiCalendar />
            </span>
            <span>25 Ago 2021</span>
            <span>
              <FiUser />
            </span>
            <span>Joseph Climber</span>
          </div>
        </div>
        <div className={styles.post}>
          <h1 className={styles.title}>Criando um app CRA do zero </h1>
          <p className={styles.subtitle}>
            Tudo sobre como criar a sua própria aplicação utilizando Create
            React App
          </p>
          <div className={styles.info}>
            <span>
              <FiCalendar />
            </span>
            <span>25 Ago 2021</span>
            <span>
              <FiUser />
            </span>
            <span>Joseph Climber</span>
          </div>
        </div>

        <span className={styles.loadMore}>Carregar mais posts</span>
      </div>
    </>
  )
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
