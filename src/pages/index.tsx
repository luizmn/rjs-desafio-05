/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState } from "react";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { FiCalendar, FiUser } from "react-icons/fi";

import Prismic from "@prismicio/client";
import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

import Header from "../components/Header";


interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
  previewData: Post[] | null;
}

// interface Preview {
//   preview: boolean;
// }

// interface PreviewData {
//   previewData: Post[] | null;
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home({ postsPagination, preview }: HomeProps) {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  // eslint-disable-next-line consistent-return
  async function loadMorePosts(): Promise<void> {
    if (nextPage === null) {
      return;
    }

    const postsResults = await fetch(nextPage)
      .then((response) => response.json())
      .then((data) => {
        setNextPage(data.next_page);
        return data.results;
      });

    const newPosts = postsResults.map((post) => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <div className={commonStyles.container}>
        <Header />
        <div>
          {posts.map((post) => (
            <div className={styles.post} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <a>
                  <h1 className={commonStyles.title}>{post.data.title}</h1>
                  <p className={commonStyles.subtitle}>{post.data.subtitle}</p>
                </a>
              </Link>
              <div className={commonStyles.info}>
                <span>
                  <FiCalendar />
                </span>
                <span>
                  {format(
                    new Date(parseISO(post.first_publication_date)),
                    "dd MMM yyyy",
                    { locale: ptBR }
                  )}
                </span>
                <span>
                  <FiUser />
                </span>
                <span>{post.data.author}</span>
              </div>
            </div>
          ))}
        </div>
        {nextPage && (
          <button
            onClick={loadMorePosts}
            className={commonStyles.loadMore}
            type="button"
          >
            Carregar mais posts
          </button>
        )}
        {preview && (
          <div className={styles.post}>
            <Link href="/api/exit-preview/">
              <a className={styles.exitButton}> Sair do modo Preview</a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at("document.type", "posts")],
    {
      pageSize: 2,
      orderings: "[document.first_publication_date desc]",
    }
  );

  const posts = postsResponse.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post?.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 60 * 1440, // 24 hours
  };
};
