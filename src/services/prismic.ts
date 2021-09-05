import Prismic from "@prismicio/client";
import { RichText } from "prismic-reactjs";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT,
    {req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}

// // In src/prismic-configuration.js
// export const linkResolver = (doc?: any) => {
//   // URL for a category type
//   // if (doc.type === "posts") {
//   return `/post/${doc.results.uid}`;
//   // }
//   // Backup for all other types
//   return "/";
// }