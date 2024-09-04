import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
{
    entry: 'state-of-css.en.md',
    base: URL {
      href: 'file:///home/.../blog-astro-ssg/content/links/',
      origin: 'null',
      protocol: 'file:',
      username: '',
      password: '',
      host: '',
      hostname: '',
      port: '',
      pathname: '/home/.../blog-astro-ssg/content/links/',
      search: '',
      searchParams: URLSearchParams {},
      hash: ''
    },
    data: {
      title: 'State of CSS',
      author: 'VanGamo',
      tags: [Array],
      itineraries: [Array],
      status: 'draft'
    }
  }
*/

const generateId = ({entry, base, data}) => {
  const entryParts = entry.split('.');

  if( entryParts.length === 0 || entryParts.length === 0 ) {
    return 'unkown';
  }
  else if( entryParts.length === 2 ) {
    return 'es-'+entryParts[0];
  }
  else {
    return entryParts[entryParts.length-2]+'-'+entryParts.slice(0, entryParts.length-2).join('.');
  }
}

const links = defineCollection({
  // The ID is a slug generated from the path of the file relative to `base`
  loader: glob({ pattern: "**/*.md", base: "./content/links", generateId: generateId }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    itineraries: z.array(z.string()),
    status: z.enum(['draft', 'published']),
  })
});

export const collections = { links };

/*
import { defineCollection } from 'astro:content';
 
import { linksLoader } from '../loaders/localGit';
 
const linksCollection = defineCollection({
  type: 'content_layer',
	loader: linksLoader,
  /* schema: {} * /
});
 
export const collections = {
	linksCollection,
};
*/