import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { FiCalendar, FiUser } from "react-icons/fi";

import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

import Header from "../components/Header";
import { useState } from "react";

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
}

export default function Home({ posts }: Post) {

  return (
    <div className={styles.container}>
      <Head>
        <title>Posts</title>
      </Head>
      <Header />
      {posts.map((post) => (

         <div className={styles.post} key={post.uid}>
          <Link href={`/post/${post.uid}`}>
            <a>
              <h1 className={commonStyles.title}>{post.title}</h1>
              <p className={commonStyles.subtitle}>{post.subtitle}</p>
            </a>
          </Link>
          <div className={commonStyles.info}>
            <span>
              <FiCalendar />
            </span>
            <span>{post.first_publication_date}</span>
            <span>
              <FiUser />
            </span>
            <span>{post.author}</span>
          </div>
        </div>
      ))}
      {/* {posts.next_page !== null && (
        <span className={commonStyles.loadMore}>Carregar mais posts</span>
        )} */}
      {/* {!posts.next_page ? (
        <span className={commonStyles.loadMore}>Carregar mais posts</span>
      ) : (
        <h1>sim</h1>
      )} */}
      {/* {posts[page].next_page !== null && <button onClick={nextPage}>Carregar mais posts</button>}
      {posts[page].next_page === null && <h1>Nao ha mais posts</h1>} */}
      <button>Carregar mais posts</button>

    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at("document.type", "posts"),
  ],{
    fetch: ['posts.data.title', 'posts.data.subtitle', 'posts.data.author', 'posts.data.content'],
    pageSize: 1,
    // page: 1,
  })
  // .then((response) => {
  //   return console.log(response.results);
  // });

  const posts = postsResponse.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(parseISO(post.first_publication_date)),
        "dd MMM yyyy",
        { locale: ptBR }
      ),
      title: post.data.title,
      subtitle: post?.data.subtitle,
      author: post.data.author,
      next_page: postsResponse.next_page,
      total_pages: postsResponse.total_pages,
  }
  });
  console.log("postsResponse")
  console.log(postsResponse.next_page)
  if (postsResponse.next_page === null) {
    console.log("É null")
  }
  return {
    props: {
      posts,
    }
  }
}