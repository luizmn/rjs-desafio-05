import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";

import readingTime from "reading-time";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { RichText } from "prismic-dom";
import Prismic from "@prismicio/client";
import { getPrismicClient } from "../../services/prismic";

import commonStyles from "../../styles/common.module.scss";
import styles from "./post.module.scss";
import Header from "../../components/Header";

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
      imgWidth: number;
      imgHeight: number;
      imgAlt: string;
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

export default function Post({ post }: PostProps) {
  const router = useRouter();
  if (router.isFallback) {
    return <div className={commonStyles.loadMore}>Carregando...</div>;
  };

  function calcReadTime(words: any) {
    let accText = "";
    let total = 0;
    const totalWords = post.data.content.map(contentItem => {
      total += contentItem.heading.split(' ').length;
      contentItem.body.text.map(item => {
        return (accText += item.text + " ");
      });
      const accWordsText = accText.split(" ").length + total;
      return accWordsText;
    });
    const readTime = totalWords[0].toString().length / 200;
    const result = Math.ceil(readTime);
    return result;
  }

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
            <title>{post?.data.title} | spacetraveling</title>
          </Head>
          <Header />
          <span className={styles.fill}>
            <Image
              src={post.data.banner.url}
              width={post.data.banner.imgWidth}
              height={post.data.banner.imgHeight}
              alt={post.data.banner.imgAlt}
            />
          </span>
          <div className={styles.container}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.info}>
              <span>
                <FiCalendar />
              </span>
              <span>{post.first_publication_date}</span>
              <span>
                <FiUser />
              </span>
              <span>{post.data.author}</span>
              <span>
                <FiClock />
              </span>
              <span>{calcReadTime(post.data.content)} min</span>
            </div>
            <div className={styles.post}>
              {post.data.content.map((postContent) => {
                return (
                  <div key={postContent.heading}>
                    <h2>{postContent.heading}</h2>
                    <div
                      className={styles.postContent}
                      dangerouslySetInnerHTML={{
                        __html: RichText.asHtml(postContent.body.text),
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
  const posts = await prismic.query(
    [Prismic.Predicates.at("document.type", "posts")],
    {
      fetch: ["posts.title", "posts.uid"],
      pageSize: 20,
    }
  );


  const paths = posts.results.map((post) => ({
    params: {
      title: post.data.title,
      slug: post.uid,
    },
  }));
  // console.log("paths");
  // console.log(paths);
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const postsResponse = await prismic.getByUID("posts", String(slug), {});

  if (typeof postsResponse !== "undefined") {
    const post = {
      slug,
      first_publication_date: format(
        new Date(parseISO(postsResponse?.first_publication_date)),
        "dd MMM yyyy",
        { locale: ptBR }
      ),
      data: {
        title: postsResponse.data.title,
        banner: {
          url: postsResponse.data.banner.url,
          imgAlt: postsResponse.data.banner.alt,
          imgWidth: postsResponse.data.banner.dimensions.width,
          imgHeight: postsResponse.data.banner.dimensions.height,
        },
        author: postsResponse.data.author,
        content: postsResponse?.data.content.map((content) => ({
          heading: content.heading,
          body: {
            text: [...content.body],
          }
        }))
      },
    };

    // console.log("POSTS AFTER ALTER")
    // console.log(post.data.content[0].body.text.length)
        // data: {
    //   title: string;
    //   banner: {
    //     url: string;
    //   };
    //   author: string;
    //   content: {
    //     heading: string;
    //     body: {
    //       text: string;
    //     }[];
    //   }[];
    // };

  //   title: postsResponse.data.title,
  //   author: postsResponse.data.author,
  //   img: postsResponse.data.banner.url,
  //   imgAlt: postsResponse.data.banner.alt,
  //   imgWidth: postsResponse.data.banner.dimensions.width,
  //   imgHeight: postsResponse.data.banner.dimensions.height,
  //   content: postsResponse?.data.content.map((content) => ({
  //     heading: content.heading,
  //     text: [...content.body],
  //   })),
  // };



    return {
      props: {
        post,
      },
    };
  } else {
    const post = null;
    return {
      props: {
        post,
      },
    };
  }
};
