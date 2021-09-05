import Prismic from "@prismicio/client";
import { Link, RichText } from "prismic-reactjs";

// In src/prismic-configuration.js
export function linkResolver(doc) {
  console.log("document link resolver")
       console.log(JSON.stringify(doc,null,2))
  // if (doc.type === "posts") {
    return "/post/" + (
      doc.results.map(item => {
        item.uid
        return ( item.uid )}
        )
    )
  // }
  // return "/";
}
// export const linkResolver = (doc?: any) => {
//   // URL for a category type
//   // if (doc.type === "posts") {

//     console.log("document link resolver")
//     console.log(JSON.stringify(doc,null,2))

//   return `/post/${doc.results.uid}`;
//   // }
//   // Backup for all other types
//   return "/";
// }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function TextField({ document }: any) {


  return (
    <div>
      <Link href={linkResolver(document)}>
        <a>
          LinkResolver
          {/* <RichText render={document} linkResolver={linkResolver} /> */}
        </a>
      </Link>
    </div>
  )
}