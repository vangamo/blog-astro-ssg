// <https://dev.to/fkurz/extending-astrojs-markdown-processing-with-remark-and-rehype-plugins-m1k>

export const remarkPlugin = (options) => {
  console.log(options);

  return function (tree) {
    console.log(tree);

    console.log(tree.children[1].children);
    tree.children[1].type = 'infograph';
    tree.children[1].class = 'infography';
    tree.children[1].tagName = 'code';
    //tree.slides = tree.children[1].children[0].value.split('\n').map(t => ({type:'text', class:'infography', meta:'infography', value:`<dd>${t}</dd>`}));
  };
};
// <https://docs.astro.build/en/guides/markdown-content/#modifying-frontmatter-programmatically>

export const rehypePlugin = (args) => {
  console.log('REHYPE');
  console.log(args);

  return (tree, file) => {
    console.log({ tree, file });
    console.log(tree.children);
  };
}
