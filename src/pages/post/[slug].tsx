/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import React, { useMemo } from "react";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";
import commonStyles from "../../styles/common.module.scss";
import styles from "./post.module.scss";
import Header from "../../components/Header";
import Comments from "../../components/Utterances";
import ExitPreviewButton from "../../components/ExitPreviewButton";

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  prevPostUid: string | null;
  prevPostTitle: string | null;
  nextPostUid: string | null;
  nextPostTitle: string | null;
  data: {
    title: string;
    banner: {
      url: string;
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
  preview: boolean;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Post({ post, preview }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <div className={commonStyles.loadMore}>Carregando...</div>;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const readTime = useMemo(() => {
    if (router.isFallback) {
      return 0;
    }

    let fullText = "";

    post.data.content.forEach((postContent) => {
      fullText += postContent.heading;
      fullText += RichText.asText(postContent.body);
    });
    const time = Math.ceil(fullText.split(/\s/g).length / 200);
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
              <span>
                <FiClock />
              </span>
              <span>{`${readTime} min`}</span>
              <div>
                <span>
                  Editado em{" "}
                  {format(
                    new Date(parseISO(post.last_publication_date)),
                    "dd MMM yyyy",
                    { locale: ptBR }
                  )}{" "}
                  &agrave;s{" "}
                  {format(
                    new Date(parseISO(post.first_publication_date)),
                    "HH:mm"
                  )}
                </span>
              </div>
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
              <hr className={styles.divider} />
              <div className={styles.grid}>
                {post.prevPostUid && (
                  <span className={styles.leftButton}>
                    <Link href={`/post/${post.prevPostUid}`}>
                      <a>
                        <p className={commonStyles.subtitle}>
                          {post.prevPostTitle}
                        </p>
                        Post anterior
                      </a>
                    </Link>
                  </span>
                )}
                {post.nextPostUid && (
                  <span className={styles.rightButton}>
                    <Link href={`/post/${post.nextPostUid}`}>
                      <a>
                        <p className={commonStyles.subtitle}>
                          {post.nextPostTitle}
                        </p>
                        Pr&oacute;ximo Post
                      </a>
                    </Link>
                  </span>
                )}
              </div>
              <Comments />
              {preview && (
                <div className={styles.post}>
                  <Link href="/api/exit-preview/">
                    <a className={styles.exitButton}> Sair do modo Preview</a>
                  </Link>
                </div>
              )}
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

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
  previewData,
}) => {
  const { slug } = params;

  // console.log ("previewData", res.previewData)
  // const { previewData } = res.previewData;

  // console.log("previewData SLUG", previewData);
  const prismic = getPrismicClient();
  const postsResponse = await prismic.getByUID("posts", String(slug), {
    ref: previewData?.ref || null,
    });

  if (typeof postsResponse !== "undefined") {
    const post = {
      uid: postsResponse.uid,
      first_publication_date: postsResponse?.first_publication_date,
      last_publication_date: postsResponse?.last_publication_date,
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

    const prevPostResponse = await prismic.query(
      [
        Prismic.predicates.dateBefore(
          "document.first_publication_date",
          post.first_publication_date
        ),
      ],
      {
        pageSize: 1,
      }
    );
    if (prevPostResponse.total_results_size > 0) {
      post.prevPostUid = prevPostResponse?.results[0].uid;
      post.prevPostTitle = prevPostResponse?.results[0].data.title;
    } else {
      post.prevPostUid = null;
    }


    const nextPageResponse = await prismic.query(
      [
        Prismic.predicates.dateAfter(
          "document.first_publication_date",
          post.first_publication_date
        ),
      ],
      {
        pageSize: 1,
      }
    );
    if (nextPageResponse.total_results_size > 0) {
      post.nextPostUid = nextPageResponse?.results[0].uid;
      post.nextPostTitle = nextPageResponse?.results[0].data.title;
    } else {
      post.nextPostUid = null;
    }


    return {
      props: {
        post,
        preview,
      },
      revalidate: 1800,
    };
  }
};
