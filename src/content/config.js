import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const generateId = ({ entry, base, data }) => {
  const entryParts = entry.split('.');

  if (entryParts.length === 0 || entryParts.length === 0) {
    return 'unknown';
  } else if (entryParts.length === 2) {
    return 'es-' + entryParts[0];
  } else {
    const lastPart = entryParts.at(-2);

    if (['es', 'en'].includes(lastPart)) {
      return entryParts.at(-2) + '-' + entryParts.slice(0, -2).join('.');
    } else {
      return 'es-' + entryParts.join('.');
    }
  }
};

const links = defineCollection({
  // The ID is a slug generated from the path of the file relative to `base`
  loader: glob({
    pattern: '**/!(README).md',
    base: './content/links',
    generateId: generateId,
  }),
  /*type: 'content', they'll be Markdown files ('data' for yaml files) */
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    status: z.enum([
      'draft',
      'published',
      'published-no-index',
      'published-to-complete',
      'notes',
      'scheduled',
    ]),
    date: z.object({
      created: z.string(),
      edited: z.string().optional(),
      published: z.string().optional(),
    }),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    brief: z.string(),
    link: z.string().url(),
    origin: z.string(),
  }),
});

const posts = defineCollection({
  // The ID is a slug generated from the path of the file relative to `base`
  loader: glob({
    pattern: '**/!(README).md',
    base: './content/posts',
    generateId: generateId,
  }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    tags: z.array(z.string()),
    status: z.enum([
      'draft',
      'published',
      'published-no-index',
      'published-to-complete',
      'notes',
      'scheduled',
    ]),
    date: z.object({
      created: z.string(),
      edited: z.string().optional(),
      published: z.string().optional(),
    }),
    image: z
      .object({
        url: z.string(),
        alt: z.string(),
      })
      .optional(),
    brief: z.string(),
    'related-posts': z.array(z.string()).optional(),
  }),
});

export const collections = { links, posts };
