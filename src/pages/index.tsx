import { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { FiCalendar, FiUser } from "react-icons/fi";
import ReactPaginate from "react-paginate";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";
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
}

export default function Home({ postsPagination }: HomeProps) {
// export default function Home({ props }: HomeProps) {

  // console.log("postsPagination")
  // console.log(postsPagination.results)


  const [postsData, setPostsData] = useState<PostPagination>({postsPagination});
  console.log("postsData")
  console.log(postsData.postsPagination)


  const [posts, setPosts] = useState(postsPagination.results);

  const [counter, setCounter] = useState(0);

  async function loadMorePosts(): Promise<void> {

    setCounter(counter + 1);
    // console.log("postsData.next_page")
    // console.log(postsData.title)

    const response = await fetch(`${postsPagination.next_page}`).then((data) =>
      data.json()
    );

    // console.log("loadmoreposts response")
    // console.log(response)

    const postsResponseResults = postsData.results.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));

    // console.log("postsResponseResults")
    // console.log(postsResponseResults)

    // postsResponse.results.map((post: any) => {
    //   return {
    //     uid: post.uid,
    //     first_publication_date: format(
    //       new Date(parseISO(post.first_publication_date)),
    //       "dd MMM yyyy",
    //       { locale: ptBR }
    //     ),
    //     title: post.data.title,
    //     subtitle: post?.data.subtitle,
    //     author: post.data.author,
    // }
    // })


    const newPosts = {
      ...posts,
      next_page: response.next_page,
      results: [...posts.results, ...postsResponseResults],
    };

    setPosts(newPosts);
  }

  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Posts</title>
      </Head>
      <Header />
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
            <span>{post.first_publication_date}</span>
            <span>
              <FiUser />
            </span>
            <span>{post.data.author}</span>
          </div>
        </div>
      ))}
      {/* <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel={""}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={posts.total_pages}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
      /> */}


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
      <button type="button" onClick={loadMorePosts}>
        Carregar mais posts
      </button>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at("document.type", "posts")],
    {
      fetch: ["posts.title", "posts.uid"],
      pageSize: 20,
    }
  )

  const paths = posts.results.map((post) => ({
    params: {
      title: post.data.title,
      slug: post.uid,
    },
  }))
  // console.log("paths as index")
  // console.log(paths)
  return {
    paths,
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at("document.type", "posts"),
    ],{
      fetch: [
        "posts.data.title",
        "posts.data.subtitle",
        "posts.data.author",
        "posts.data.content",
      ],
      pageSize: 2,
    // page: 1,
    }
  )

  const posts = postsResponse.results.map((post: any) => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(parseISO(post.first_publication_date)),
        "dd MMM yyyy",
        { locale: ptBR }
      ),
      data: {
        title: post.data.title,
        subtitle: post?.data.subtitle,
        author: post.data.author,
      }
    };
  });

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: posts,
  };

  return {
    props: {
      posts,
      postsPagination,
    },
    revalidate: 60 * 1440, // 24 hours
  }
}