import { useState, useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import axios from "axios";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { FiCalendar, FiUser } from "react-icons/fi";

import Prismic from "@prismicio/client";
// import { RichText } from "prismic-dom";
import { RichText } from "prismic-reactjs";
import { getPrismicClient } from "../services/prismic";

import commonStyles from "../styles/common.module.scss";
import styles from "./home.module.scss";

import Header from "../components/Header";
import TextField from "../components/LinkResolver";

import { linkResolver } from "../components/LinkResolver";

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
  let morePages;
  let actualPage = 0;
  // let morePagesButton = "";

  const [morePosts, setMorePosts] = useState<PostPagination>({
     postsPagination,
   });

  const [posts, setPosts] = useState(postsPagination.results);
  const [pagesQuantity, setPagesQuantity] = useState(
    Math.floor(postsPagination.results.length / 2)
  );

  const [nextPage, setNextPage] = useState(postsPagination.next_page);
  // const [currentPage, setCurrentPage] = useState(0);


  function paginatePosts(array, page_size, page_number) {
    // const page_size = 2;
    return array.slice(page_number * page_size, page_number * page_size + page_size);
  };

  const initialPaginatedPosts = paginatePosts(postsPagination.results, 2, actualPage)

  const [postsPaginated, setPostsPaginated] = useState(initialPaginatedPosts);

  async function loadMorePosts(e): Promise<void> {
    e.preventDefault();

    try {
      const postsResults = await axios
        .get(`${nextPage}`)
        .then((response) => {
          setNextPage(response.data.next_page);
          return response.data.results;
        })
        .catch(function (error) {
          console.log(error);
        });

      const newPosts = postsResults.map((post) => {
        return {
          uid: post.uid,
          first_publication_date: format(
            new Date(post.first_publication_date),
            "dd MMM yyyy",
            {
              locale: ptBR,
            }
          ),
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        };
      });

      setPosts([...posts, ...newPosts]);

     } catch (error) {
       console.error(error);
     }
   }


  // Array pagination function
  // array, page_size, page_number
  // const paginateGood = (array, page_size, page_number) => {
  //   return array.slice(page_number * page_size, page_number * page_size + page_size);
  // };


  return (
    <div className={commonStyles.container}>
      <Head>
        <title>Posts</title>
      </Head>
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
            <span>{post.first_publication_date}</span>
            <span>
              <FiUser />
            </span>
            <span>{post.author}</span>
          </div>
        </div>
      ))}
      </div>
      {nextPage && (
        <button type="button" onClick={loadMorePosts}>
          Carregar mais posts
        </button>
      )}

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.Predicates.at("document.type", "posts")],
    {
      fetch: ["posts.title", "posts.uid"],
      pageSize: 5,
    }
  )

  const paths = posts.results.map((post) => ({
    params: {
      title: post.data.title,
      slug: post.uid,
    },
  }))

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
      orderings: "[document.first_publication_date desc]",
      // page: 1,
    }
  )
  //Query ALL Documents
  // const postsResponse = await prismic
  //   .query([Prismic.Predicates.at("document.type", "posts")
  // ], {pageSize: 1, page: 1})
  //   .then(
  //     function (response) {
  //       console.log("Documents: ", response.results);
  //       return response;
  //     },
  //     function (err) {
  //       console.log("Something went wrong: ", err);
  //     });


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
      // posts,
      postsPagination,
    },
    revalidate: 60 * 1440, // 24 hours
  }
}