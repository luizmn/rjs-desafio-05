import Head from "next/head";
import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";

import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { RichText } from "prismic-dom";
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

  function calcReadTime(text: any) {
    const words = text.split(" ");
    const readTime = words.length / 200;
    const result = Math.ceil(readTime);
    return result;
  }

  return (
    <>
      <Head>
          <title>{post.title} | spacetraveling</title>
      </Head>
      <Header />
      <span className={styles.fill}>
        <Image
          src={post.img}
          // width={post.imgWidth}
          // height={post.imgHeight}
          width={post.imgWidth}
          height={post.imgHeight}
          alt={post.imgAlt}
        />
      </span>
      <div className={styles.container}>
        <h1>{post.title}</h1>
        <div className={commonStyles.info}>
          <span>
            <FiCalendar />
          </span>
          <span>{post.first_publication_date}</span>
          <span>
            <FiUser />
          </span>
          <span>{post.author}</span>
          <span>
            <FiClock />
          </span>
          <span>{calcReadTime(post.title)} min</span>
        </div>
        <div className={styles.post}>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />
        </div>
      </div>
    </>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

export const getStaticPaths: GetStaticPaths = async () => {

  //   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({  params }) => {

  const { slug } = params;

  const prismic = getPrismicClient()

  const postsResponse = await prismic.getByUID('posts', String(slug), {});

  console.log("postsResponse Slug")
  console.log(JSON.stringify(postsResponse, null, 2))

  const post = {
    slug,
    first_publication_date: format(new Date(parseISO(postsResponse.first_publication_date)), "dd MMM yyyy", { locale: ptBR }),
    title: postsResponse.data.title,
    author: postsResponse.data.author,
    img: postsResponse.data.banner.url,
    imgAlt: postsResponse.data.banner.alt,
    imgWidth: postsResponse.data.banner.dimensions.width,
    imgHeight: postsResponse.data.banner.dimensions.height,
    // content: RichText.asHtml(postsResponse?.data.content.body),
  }

  // first_publication_date: string | null;
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

  console.log("post props")
  console.log(post)
  return {
    props: {
      post,
    }
  }
}

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
