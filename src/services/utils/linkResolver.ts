var PrismicDOM = require('prismic-dom');


// Link Resolver
export default function linkResolver(doc) {

  // Define the url depending on the document type
  if (doc.type === 'posts') {
    return '/post/' + doc.uid;
  // } else if (doc.type !== 'blog_post') {
  //   return '/blog/' + doc.uid;
  }

  // Default to homepage
  return '/';
}