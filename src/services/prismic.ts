import Prismic from "@prismicio/client";
import { Document } from "@prismicio/client/types/documents";

export function getPrismicClient(req?: unknown) {
  const prismic = Prismic.client(process.env.PRISMIC_ENDPOINT,
    {req,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  return prismic;
}

export function linkResolver(doc: Document) {
  switch (doc.type) {
    case "posts":
      return `/post/${doc.uid}`;
    case "news":
      return `/news/${doc.uid}`;
    default:
      return "/";
  }
}