import { glob } from 'astro/loaders';

export const linksLoader = {
	name: 'links',
	load: async (context) => {
    const links = glob({ pattern: "**/*.md", base: "./src/data/blog" }).then(links => {console.log('IGM2', links); return links;});
    console.log('IGM', links);

    /*
    const linksRaw = import.meta.glob(['../../content/links/*.md', '!./** /README.md'])

    console.log('IGM', linksRaw);
    
    const links = {};
    for( const linkFile in linksRaw) {
      links[linkFile.replace('../../content/links/', '')] = linksRaw[linkFile];
    }

    console.log('IGM', links);

    context.store.set({
			id: 'links',
			data: links,
		});
    */

  },
};