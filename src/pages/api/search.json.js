import FlexSearch from 'flexsearch';
import { getCollection } from 'astro:content';

const userLang = 'es'; //Astro.currentLocale || 'es';

const getAllCollectionEntries = (collectionName) => {
  return getCollection(collectionName).then((entries) => {
    entries.forEach((entry) => {
      const [lang, ...slug] = entry.id.split('-');
      entry.data = {
        ...entry.data,
        lang,
        slug: slug.join('-'),
      };
    });
    return entries;
  });
};

const getAllPosts = async (lang) => {
  return await getAllCollectionEntries('posts').then((posts) =>
    posts.filter((entry) => entry.data.lang === lang)
  );
};

const getPublishedPosts = async (lang) => {
  return await getAllPosts(lang).then((posts) =>
    posts.filter(
      (entry) =>
        entry.data.status.startsWith('published') || !import.meta.env.PROD
    )
  );
};

const allPosts = [...(await getPublishedPosts(userLang))];

const exportableData = {
  cnt: [],
};

const index = new FlexSearch.Index({
  preset: 'match',
  tokenize: 'full',
  context: true,
  language: 'es',
  //  encode: "advanced",
});

allPosts.forEach((post, idx) => {
  post.data.collection = post.collection;
  delete post.data.status;
  exportableData.cnt.push(post.data);

  index.add(idx, post.data.title);
  index.append(idx, post.data.tags.join(' '));
  index.append(idx, post.content);
});

await index.export((key, value) => {
  exportableData[key] = value;
});
console.log('end');

console.log(
  index.search('cómo aprender a programar en javascript', { suggest: true })
);

export async function GET({ params, request }) {
  return new Response(JSON.stringify(exportableData));
}
