/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";

import commonStyles from "../../styles/common.module.scss";
import styles from "./post.module.scss";
import Header from "../../components/Header";
import { useMemo } from "react";

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      //imgAlt: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <div className={commonStyles.loadMore}>Carregando...</div>;
  };

  // function calcReadTime(words: any) {
  // let accText = "";
  // let total = 0;

  // const totalWords = post.data.content.map((contentItem) => {
  //   total += contentItem.heading.split(" ").length;
  //   contentItem.body?.map((item) => {
  //     return (accText += `${item.text} `);
  //   });
  //   const accWordsText = accText.split(" ").length + total;
  //   return accWordsText;
  // });
  // const readTime = Math.ceil(totalWords[0].toString().length / 200);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const readTime = useMemo(() => {
    if (router.isFallback) {
      return 0;
    }

    let fullText = "";
    const readWordsPerMinute = 200;

    post.data.content.forEach((postContent) => {
      fullText += postContent.heading;
      fullText += RichText.asText(postContent.body);
    });

    const time = Math.ceil(fullText.split(/\s/g).length / readWordsPerMinute);

    return time;
  }, [post, router.isFallback]);

  return (
    <>
      {!post ? (
        <>
          <Head>
            <title>Post n&atilde;o encontrado | spacetraveling</title>
          </Head>
          <Header />
          <h1>Post n&atilde;o encontrado!</h1>
          <span className={commonStyles.loadMore}>
            <Link href="/">
              <a>Voltar para a página inicial</a>
            </Link>
          </span>
        </>
      ) : (
        <>
          <Head>
            <title>{`${post?.data.title} | `} spacetraveling</title>
          </Head>
          <Header />
          <span className={styles.fill}>
            <img src={post?.data.banner.url} alt="imagem" />
          </span>
          <div className={styles.container}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.info}>
              <span>
                <FiCalendar />
              </span>
              <span>{format(
                  new Date(parseISO(post.first_publication_date)),
                  "dd MMM yyyy",
                  { locale: ptBR }
                )}
              </span>
              <span>
                <FiUser />
              </span>
              <span>{post.data.author}</span>
              <span>
                <FiClock />
              </span>
              <span>{`${readTime} min`}</span>
            </div>
            <div className={styles.post}>
              {post.data.content.map((postContent) => {
                return (
                  <div key={postContent.heading}>
                    <h2>{postContent.heading}</h2>
                    <div
                      className={styles.postContent}
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(postContent.body),
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([
    Prismic.Predicates.at("document.type", "posts"),
  ]);

  const paths = posts.results.map((post) => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const postsResponse = await prismic.getByUID("posts", String(slug), {} || null);

  if (typeof postsResponse !== "undefined") {
    const post = {
      uid: postsResponse.uid,
      first_publication_date: postsResponse?.first_publication_date,
      data: {
        title: postsResponse.data.title,
        subtitle: postsResponse.data.subtitle,
        author: postsResponse.data.author,
        banner: {
          url: postsResponse.data.banner.url,
        },
        content: postsResponse?.data.content.map((content) => {
          return {
            heading: content.heading,
            body: [...content.body],
          }
        })
      },
    };
    // const prevPageResponse = await prismic.query(
    //   [
    //     Prismic.predicates.dateBefore(
    //       'document.first_publication_date',
    //       post.first_publication_date
    //     ),
    //   ],
    //   {
    //     pageSize: 1,
    //   }
    // );

    return {
      props: {
        post,
      },
      revalidate: 1800,
  };
  }
  // else {
  //   const post = null;
  //   return {
  //     props: {
  //       post,
  //     },
  //   };
  // }
};
