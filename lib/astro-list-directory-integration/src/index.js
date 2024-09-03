export default function () {
  return {
    name: "vangamo/list-directory-integration",
    hooks: {
      'astro:config:setup': ({config}) => {
        console.log('config', config);
      },
      "astro:build:start": async ({ logger }) => {
        logger.warn('It works!')
      },
    },
  };
}
